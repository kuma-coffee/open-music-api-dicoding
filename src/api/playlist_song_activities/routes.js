const routes = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: (request, h) =>
      handler.getPlaylistSongActivitiesHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
];

module.exports = routes;
