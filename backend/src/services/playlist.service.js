import Playlist from "../models/playlist.model.js";
import mongoose from "mongoose";

// Create playlist
export const createPlaylist = async ({ userId, name, description, isPublic }) => {
  return await Playlist.create({
    userId,
    name,
    description: description || "",
    isPublic: !!isPublic,
  });
};

// Get my playlists
export const getMyPlaylists = async (userId) => {
  return await Playlist.find({ userId })
    .sort({ createdAt: -1 })
    .populate("videos", "thumbnailUrl title duration createdAt") 
    .lean();
};

// Get single playlist (with privacy)
export const getPlaylistById = async (playlistId, requesterId) => {
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new Error("Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title thumbnailUrl duration views likesCount createdAt owner")
    .lean();

  if (!playlist) return null;

  if (!playlist.isPublic && playlist.userId.toString() !== requesterId.toString()) {
    return { notAllowed: true };
  }

  return playlist;
};

// Add video to playlist
export const addVideoToPlaylist = async (userId, playlistId, videoId) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new Error("Playlist not found");

  if (playlist.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  if (playlist.videos.some((v) => v.toString() === videoId.toString())) {
    return { alreadyExists: true };
  }

  playlist.videos.push(videoId);
  await playlist.save();

  return { added: true };
};

// Remove video
export const removeVideoFromPlaylist = async (userId, playlistId, videoId) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new Error("Playlist not found");

  if (playlist.userId.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  const original = playlist.videos.length;
  playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId.toString());
  await playlist.save();

  return { removed: playlist.videos.length < original };
};

// Delete playlist
export const deletePlaylist = async (userId, playlistId) => {
  const deleted = await Playlist.findOneAndDelete({ _id: playlistId, userId });

  return { deleted: !!deleted };
};
