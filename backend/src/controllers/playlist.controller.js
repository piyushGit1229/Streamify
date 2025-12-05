import asyncHandler from "../utils/asyncHandler.js";
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../services/playlist.service.js";

export const createNewPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description, isPublic } = req.body;

  const playlist = await createPlaylist({ userId, name, description, isPublic });

  res.status(201).json({
    success: true,
    playlist,
  });
});

export const myPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await getMyPlaylists(userId);

  res.json({
    success: true,
    playlists,
  });
});

export const getPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId } = req.params;

  const playlist = await getPlaylistById(playlistId, userId);

  if (!playlist) {
    return res.status(404).json({ success: false, message: "Playlist not found" });
  }

  if (playlist.notAllowed) {
    return res.status(403).json({ success: false, message: "This playlist is private" });
  }

  res.json({
    success: true,
    playlist,
  });
});

export const addVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId, videoId } = req.params;

  const result = await addVideoToPlaylist(userId, playlistId, videoId);

  res.json({
    success: true,
    ...result,
  });
});

export const removeVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId, videoId } = req.params;

  const result = await removeVideoFromPlaylist(userId, playlistId, videoId);

  res.json({
    success: true,
    ...result,
  });
});

export const removePlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId } = req.params;

  const result = await deletePlaylist(userId, playlistId);

  res.json({
    success: true,
    ...result,
  });
});
