require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const config = require("./utils/config");
const path = require("path");

// error
const ClientError = require("./exceptions/ClientError");

// albums
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/albumsService");
const AlbumsValidator = require("./validator/albums");

// songs
const songs = require("./api/songs");
const SongsService = require("./services/postgres/songsService");
const SongsValidator = require("./validator/songs");

// playlist
const playlists = require("./api/playlists");
const PlaylistsService = require("./services/postgres/playlistsService");
const PlaylistsValidator = require("./validator/playlist");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/usersService");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/authenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/collaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

// playlist songs collaborations
const playlistsongs = require("./api/playlist_songs");
const PlaylistSongsService = require("./services/postgres/playlistSongsService");
const PlaylistSongsValidator = require("./validator/playlist_songs");

// playlist song activities
const playlistsongactivities = require("./api/playlist_song_activities");
const PlaylistSongActivitiesService = require("./services/postgres/playlistSongActivitiesService");
const PlaylistSongActivitiesValidator = require("./validator/playlist_song_activities");

// exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

// user album likes
const useralbumlikes = require("./api/user_album_likes");
const UserAlbumLikesService = require("./services/postgres/userAlbumLikesService");

// cache
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService();
  const playlistSongsService = new PlaylistSongsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.Server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("openmusicapi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: { albumsService, songsService },
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: { collaborationsService, playlistsService, usersService },
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        service: {
          playlistSongsService,
          playlistsService,
          songsService,
          playlistSongActivitiesService,
        },
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: playlistsongactivities,
      options: {
        service: {
          playlistsService,
          playlistSongActivitiesService,
        },
        validator: PlaylistSongActivitiesValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: { storageService, albumsService },
        validator: UploadsValidator,
      },
    },
    {
      plugin: useralbumlikes,
      options: {
        service: userAlbumLikesService,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
