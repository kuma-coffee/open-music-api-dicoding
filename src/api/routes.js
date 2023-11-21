const albumsRoutes = (albumHandler) => [
  {
    method: "POST",
    path: "/albums",
    handler: albumHandler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums",
    handler: albumHandler.getAlbumsHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: albumHandler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: albumHandler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: albumHandler.deleteAlbumByIdHandler,
  },
];

const songsRoutes = (songHandler) => [
  {
    method: "POST",
    path: "/songs",
    handler: songHandler.postSongHandler,
  },
  {
    method: "GET",
    path: "/songs",
    handler: songHandler.getSongsHandler,
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: songHandler.getSongByIdHandler,
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: songHandler.putSongByIdHandler,
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: songHandler.deleteSongByIdHandler,
  },
];

const routes = (albumHandler, songHandler) => [
  ...albumsRoutes(albumHandler),
  ...songsRoutes(songHandler),
];

module.exports = routes;
