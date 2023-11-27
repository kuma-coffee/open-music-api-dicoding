class PlaylistSongActivitiesHandler {
  constructor(playlistsService, playlistSongActivitiesService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    this._validator = validator;
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongActivities =
      await this._playlistSongActivitiesService.getPlaylistSongActivities(
        playlistId
      );

    return {
      status: "success",
      message: "Mendapatkan semua playlist song activities",
      data: {
        playlistId,
        activities: [...playlistSongActivities],
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
