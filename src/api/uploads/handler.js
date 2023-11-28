const config = require("../../utils/config");
const path = require("path");

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation: `http://${config.app.host}:${config.app.port}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }

  async getUploadImageById(request, h) {
    const { id: albumId } = request.params;

    const albumById = await this._albumsService.getAlbumById(albumId);
    const path = path.resolve(__dirname, "file");

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        album: {
          id: albumById.id,
          name: albumById.name,
          coverUrl: path,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
