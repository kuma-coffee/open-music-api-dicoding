const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.postPlaylistSongsHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.getPlaylistSongsByIdHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.deletePlaylistSongsHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
];

module.exports = routes;
