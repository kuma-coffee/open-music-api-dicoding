const AlbumHandler = require("./handler");
const SongHandler = require("../songs/handler");
const routes = require("./routes");

module.exports = {
  name: "handler",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(
      service.albumsService,
      service.songsService,
      validator
    );
    server.route(routes(albumHandler));
  },
};
