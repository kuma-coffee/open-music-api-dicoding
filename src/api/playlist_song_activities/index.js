const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistsongactivites",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service.playlistsService,
      service.playlistSongActivitiesService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
