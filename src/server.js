require("dotenv").config();

const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({});

  await server.start();
  console.log(`Server running on ${server.infor.url}`);
};

init();
