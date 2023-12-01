const fs = require("fs").promises;
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBToAlbum, mapDBToSong } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Adding Album failed");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");

    return result.rows.map(mapDBToAlbum);
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album not found");
    }

    return mapDBToAlbum(result.rows[0]);
  }

  async editAlbumById(id, { name, year }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Updating Album failed, Id not found");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Deleting Album failed, Id not found");
    }
  }

  async addAlbumCover(cover, id) {
    const updateAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id",
      values: [cover, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Updating Album failed, Id not found");
    }
  }

  async getCoverName(id) {
    const query = {
      text: "SELECT cover FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album not found");
    }

    return result.rows[0];
  }
}

module.exports = AlbumService;
