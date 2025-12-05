import Interaction from "../models/interaction.model.js";
import Video from "../models/video.model.js";

/**
 * LIKE logic:
 * - If no entry → create like
 * - If dislike exists → update to like
 * - If like exists → remove like (toggle)
 */
export const toggleLike = async (userId, videoId) => {
  let record = await Interaction.findOne({ userId, videoId });

  // CASE 1: No interaction → create LIKE
  if (!record) {
    await Interaction.create({ userId, videoId, status: "like" });
    await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: 1 } });
  }

  // CASE 2: Previously disliked → switch to LIKE
  else if (record.status === "dislike") {
    record.status = "like";
    await record.save();
    await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: 1 } });
  }

  // CASE 3: Already liked → remove LIKE
  else if (record.status === "like") {
    await Interaction.deleteOne({ _id: record._id });
    await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: -1 } });
  }

  // Fetch updated like count
  const video = await Video.findById(videoId);

  // Recalculate total dislikes
  const dislikesCount = await Interaction.countDocuments({
    videoId,
    status: "dislike",
  });

  // Fetch updated user interaction
  const updated = await Interaction.findOne({ userId, videoId });

  return {
    status: updated?.status || "none",
    likesCount: video.likesCount,
    dislikesCount,
    isLiked: updated?.status === "like",
    isDisliked: updated?.status === "dislike",
  };
};

/**
 * DISLIKE logic:
 * - If no entry → create dislike
 * - If liked exists → change to dislike
 * - If disliked exists → remove
 */
export const toggleDislike = async (userId, videoId) => {
  let record = await Interaction.findOne({ userId, videoId });

  // CASE 1: No record → create DISLIKE
  if (!record) {
    await Interaction.create({ userId, videoId, status: "dislike" });
  }

  // CASE 2: Was liked → switch to DISLIKE
  else if (record.status === "like") {
    record.status = "dislike";
    await record.save();
    await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: -1 } });
  }

  // CASE 3: Already disliked → remove DISLIKE
  else if (record.status === "dislike") {
    await Interaction.deleteOne({ _id: record._id });
  }

  // Fetch updated like count
  const video = await Video.findById(videoId);

  // Recalculate dislikes
  const dislikesCount = await Interaction.countDocuments({
    videoId,
    status: "dislike",
  });

  // Fetch updated interaction
  const updated = await Interaction.findOne({ userId, videoId });

  return {
    status: updated?.status || "none",
    likesCount: video.likesCount,
    dislikesCount,
    isLiked: updated?.status === "like",
    isDisliked: updated?.status === "dislike",
  };
};

// ============================================
// GET ALL LIKED VIDEOS
// ============================================
export const getLikedVideos = async (userId) => {
  return await Interaction.find({ userId, status: "like" })
    .populate("videoId")
    .lean();
};

// ============================================
// GET ALL DISLIKED VIDEOS
// ============================================
export const getDislikedVideos = async (userId) => {
  return await Interaction.find({ userId, status: "dislike" })
    .populate("videoId")
    .lean();
};
