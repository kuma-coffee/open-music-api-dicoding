const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBToAlbum, mapDBToSong, mapDBToPlaylist } = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists(id, name, owner) VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Adding Playlist failed");
    }

    return result.rows[0].id;
  }

  async getPlaylists(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM collaborations AS c 
      LEFT JOIN playlists AS p ON p.id = c.playlist_id
      LEFT JOIN users AS u ON u.id = p.owner 
      WHERE c.user_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows == 0) {
      const query = {
        text: `SELECT p.id, p.name, u.username FROM playlists AS p 
        LEFT JOIN users AS u ON u.id = p.owner 
        WHERE p.owner = $1`,
        values: [id],
      };

      const result2 = await this._pool.query(query);
      return result2.rows.map(mapDBToPlaylist);
    }
    return result.rows.map(mapDBToPlaylist);
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists AS p 
      LEFT JOIN users AS u ON u.id = p.owner 
      WHERE p.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Get Playlist failed, Id not found");
    }

    return result.rows.map(mapDBToPlaylist)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Deleting Playlist failed, Id not found");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
