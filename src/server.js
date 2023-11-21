require("dotenv").config();

const Hapi = require("@hapi/hapi");
const openmusicapi = require("./api");
const AlbumsService = require("./services/postgres/albumsService");
const SongsService = require("./services/postgres/songsService");
const Validator = require("./validator/index");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: openmusicapi,
    options: {
      service: {
        albumsService,
        songsService,
      },
      validator: Validator,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
