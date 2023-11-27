class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title = "untitled",
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Menambahkan lagu",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    let { title } = request.query;
    let { performer } = request.query;

    if (typeof title === "undefined") {
      title = "";
    }

    if (typeof performer === "undefined") {
      performer = "";
    }

    const songs = await this._service.getSongs({ title, performer });

    return {
      status: "success",
      message: "Mendapatkan semua lagu",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    return {
      status: "success",
      message: "Mendapatkan lagu berdasarkan id",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: "success",
      message: "Mengubah lagu berdasarkan id lagu",
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Menghapus lagu berdasarkan id lagu",
    };
  }
}

module.exports = SongHandler;
