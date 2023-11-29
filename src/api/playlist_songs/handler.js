class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    playlistsService,
    songsService,
    playlistSongActivitiesService,
    validator
  ) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      credentialId
    );
    const collaborationId = await this._playlistSongsService.addPlaylistSongs(
      playlistId,
      songId
    );

    const response = h.response({
      status: "success",
      message: "Kolaborasi berhasil ditambahkan",
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistsData = await this._playlistsService.getPlaylistById(
      playlistId
    );
    const songsOnPlaylist =
      await this._playlistSongActivitiesService.getSongsOnPlaylist(
        playlistId,
        credentialId
      );

    return {
      status: "success",
      message: "Kolaborasi berhasil dihapus",
      data: {
        playlist: {
          ...playlistsData,
          songs: [...songsOnPlaylist],
        },
      },
    };
  }

  async deletePlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongActivitiesService.deletePlaylistSongActivities(
      playlistId,
      songId
    );
    await this._playlistSongsService.deletePlaylistSongs(playlistId, songId);

    return {
      status: "success",
      message: "Kolaborasi berhasil dihapus",
    };
  }
}

module.exports = PlaylistSongsHandler;
