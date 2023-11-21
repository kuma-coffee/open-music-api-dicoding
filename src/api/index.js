const AlbumHandler = require("./albums/handler");
const SongHandler = require("./songs/handler");
const routes = require("./routes");

module.exports = {
  name: "openmusicapi",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service.albumsService, validator);
    const songHandler = new SongHandler(service.songsService, validator);
    server.route(routes(albumHandler, songHandler));
  },
};
