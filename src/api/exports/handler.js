class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;

    this._validator = validator;
  }

  async postExportSongsOnPlaylistHandler(request, h) {
    this._validator.validateExportSongsOnPlaylistPayload(request.payload);
    const { playlistId } = request.params;

    const credentialId = request.auth.credentials.id;
    const message = {
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.getPlaylistById(playlistId);

    await this._producerService.sendMessage(
      "export:songs",
      JSON.stringify(message)
    );

    const response = h.response({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
