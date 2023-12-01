const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToSong, mapDBToPlaylistSongActivities } = require("../../utils");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities(playlistId, songId, userId, action = "add") {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, ps.action, ps.time FROM playlist_song_activities AS ps
      LEFT JOIN users AS u ON u.id = ps.user_id
      LEFT JOIN songs AS s ON s.id = ps.song_id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToPlaylistSongActivities);
  }

  async deletePlaylistSongActivities(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_song_activities WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Deleting Playlist failed, Id not found");
    }
  }

  async getSongsOnPlaylist(playlistId, userId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s
      LEFT JOIN playlist_song_activities AS ps ON ps.song_id = s.id
      WHERE ps.playlist_id = $1 AND ps.user_id = $2
      GROUP BY s.id`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSong);
  }
}

module.exports = PlaylistSongActivitiesService;
