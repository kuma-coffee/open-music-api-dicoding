const mapDBToAlbum = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBToSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBToPlaylist = ({ id, name, created_at, updated_at, username }) => ({
  id,
  name,
  createdAt: created_at,
  updatedAt: updated_at,
  username,
});

const mapDBToPlaylistSongActivities = ({ username, title, action, time }) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapDBToAlbum,
  mapDBToSong,
  mapDBToPlaylist,
  mapDBToPlaylistSongActivities,
};
