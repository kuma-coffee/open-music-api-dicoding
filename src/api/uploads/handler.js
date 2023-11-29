const config = require("../../utils/config");

class UploadsHandler {
  constructor(uploadsService, albumsService, validator) {
    this._uploadsService = uploadsService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const { id: albumId } = request.params;

    // const filename = await this._uploadsService.writeFile(cover, cover.hapi, albumId);

    // const response = h.response({
    //   status: "success",
    //   message: "Sampul berhasil diunggah",
    //   data: {
    //     fileLocation: `http://${config.app.host}:${config.app.port}/upload/images/${filename}`,
    //   },
    // });

    const fileLocation = await this._uploadsService.writeFile(
      cover,
      cover.hapi
    );

    await this._albumsService.addAlbumCover(fileLocation, albumId);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
