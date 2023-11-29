const path = require("path");

class AlbumHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = "untitled", year } = request.payload;

    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Menambahkan album",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums();

    return {
      status: "success",
      message: "Mendapatkan semua album",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const albumById = await this._albumsService.getAlbumById(id);
    const songsInAlbum = await this._songsService.getSongByAlbumId(id);

    // const pathFile = path.resolve(__dirname, "..", "uploads/file/images");
    // const coverName = await this._albumsService.getCoverName(pathFile, id);
    // let cover = "";
    // if (typeof coverName === "undefined") {
    //   cover = null;
    // } else {
    //   cover = pathFile + "/" + coverName;
    // }
    // const coverName = await this._albumsService.getCoverName(pathFile, id);

    const coverName = await this._albumsService.getCoverName(id);

    return {
      status: "success",
      message: "Mendapatkan album berdasarkan id",
      data: {
        album: {
          ...albumById,
          songs: [...songsInAlbum],
          coverUrl: coverName.cover,
        },
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Mengubah album berdasarkan id album",
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: "success",
      message: "Menghapus album berdasarkan id album",
    };
  }
}

module.exports = AlbumHandler;
