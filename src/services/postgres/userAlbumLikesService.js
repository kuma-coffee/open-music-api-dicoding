const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`songs:${userId}`);
    return result.rows[0].id;
  }

  async getUserAlbumLikes(userId, albumId) {
    try {
      const result = await this._cacheService.get(`songs:${userId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError("Gagal mendapatkan data");
      }

      const mappedResult = result.rows[0];

      await this._cacheService.set(
        `songs:${userId}`,
        JSON.stringify(mappedResult)
      );

      return mappedResult;
    }
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
    await this._cacheService.delete(`songs:${userId}`);
  }
}

module.exports = UserAlbumLikesService;
