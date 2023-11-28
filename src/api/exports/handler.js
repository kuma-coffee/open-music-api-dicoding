class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportSongsOnPlaylistHandler(request, h) {
    this._validator.validateExportSongsOnPlaylistPayload(request.payload);
    const { playlistId } = request.params;

    const message = {
      playlistId: playlistId,
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage("export:songs", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
