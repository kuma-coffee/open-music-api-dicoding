const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service.collaborationsService,
      service.playlistsService,
      service.usersService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
