const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const ClientError = require("../../exceptions/ClientError");

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLikes(userId, albumId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Suka gagal ditambahkan");
    }

    await this._cacheService.delete(`songs:${albumId}`);
    return result.rows[0].id;
  }

  async getUserAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`songs:${albumId}`);
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
        `songs:${albumId}`,
        JSON.stringify(mappedResult)
      );

      return mappedResult;
    }
  }

  async getUserAlbumLikesById(userId, albumId) {
    const query = {
      text: "SELECT COALESCE(COUNT(*), 0) FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal mendapatkan data");
    }

    const count = result.rows[0].coalesce;

    if (count != 0) {
      throw new InvariantError("Like sudah ada");
    }

    return count;
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
    await this._cacheService.delete(`songs:${albumId}`);
  }
}

module.exports = UserAlbumLikesService;
