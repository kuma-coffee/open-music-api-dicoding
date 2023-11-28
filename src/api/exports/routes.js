const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: (request, h) =>
      handler.postExportSongsOnPlaylistHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
];

module.exports = routes;
