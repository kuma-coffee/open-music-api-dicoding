const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class UserAlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addUserAlbumLikes(userId, albumId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Suka gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getUserAlbumLikes(albumId) {
    const query = {
      text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal mendapatkan data");
    }

    return result.rows[0];
  }

  async deleteUserAlbumLikes(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Suka gagal dihapus");
    }
  }
}

module.exports = UserAlbumLikesService;
