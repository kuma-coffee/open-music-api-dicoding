const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.postUserAlbumLikesHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.getUserAlbumLikesByIdHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.deleteUserAlbumLikesHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
];

module.exports = routes;
