const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistsongs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service.playlistSongsService,
      service.playlistsService,
      service.songsService,
      service.playlistSongActivitiesService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
