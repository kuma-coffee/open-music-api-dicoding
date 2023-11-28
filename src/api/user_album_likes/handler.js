class UserAlbumLikesHandler {
  constructor(userAlbumLikes) {
    this._userAlbumLikes = userAlbumLikes;
  }

  async postUserAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const userAlbumLikesId = await this._userAlbumLikes.addUserAlbumLikes(
      credentialId,
      albumId
    );

    const response = h.response({
      status: "success",
      message: "Suka berhasil ditambahkan",
      data: {
        userAlbumLikesId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const userAlbumLikes = await this._userAlbumLikes.getUserAlbumLikes(
      albumId
    );
    return {
      status: "success",
      message: "Berhasil mendapatkan data suka",
      data: {
        likes: userAlbumLikes,
      },
    };
  }

  async deleteUserAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userAlbumLikes.deleteUserAlbumLikes(credentialId, albumId);
    return {
      status: "success",
      message: "Suka berhasil dihapus",
    };
  }
}

module.exports = UserAlbumLikesHandler;
