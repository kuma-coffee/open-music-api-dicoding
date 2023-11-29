const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBToAlbum, mapDBToSong } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Adding Song failed");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    const query = {
      text: "SELECT id, title, performer FROM songs",
      values: [],
    };

    let check = false;

    if (title != "") {
      title = "%" + title + "%";
      query.text += " WHERE title ILIKE $1";
      query.values.push(title);
      check = true;
    }

    if (performer != "") {
      performer = "%" + performer + "%";
      if (check) {
        query.text += " AND performer ILIKE $2";
      } else {
        query.text += " WHERE performer ILIKE $1";
      }
      query.values.push(performer);
    }

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSong);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }

    return result.rows.map(mapDBToSong)[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return [];
    }

    return result.rows.map(mapDBToSong);
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Updating Song failed, Id not found");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Deleting Song failed, Id not found");
    }
  }
}

module.exports = SongService;
