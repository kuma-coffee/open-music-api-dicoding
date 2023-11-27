const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongs(playlistId, songId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  // async getSongsOnPlaylist(playlistId) {
  //   const query = {
  //     text: `SELECT s.* FROM songs AS s
  //     LEFT JOIN playlistsongs AS c ON c.song_id = s.id
  //     WHERE c.playlist_id = $1
  //     GROUP BY s.id`,
  //     values: [playlistId],
  //   };
  //   const result = await this._pool.query(query);

  //   return result.rows.map(mapDBToPlaylist);
  // }

  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal dihapus");
    }
  }
}

module.exports = PlaylistSongsService;
