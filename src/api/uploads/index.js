const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(
      service.storageService,
      service.albumsService,
      validator
    );
    server.route(routes(uploadsHandler));
  },
};
