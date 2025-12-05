import asyncHandler from "../utils/asyncHandler.js";
import Cut from "../models/cut.model.js";
import Video from "../models/video.model.js";

// POST /api/cuts
export const createCut = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId, startSeconds, endSeconds, title } = req.body;

  if (!videoId || startSeconds == null || endSeconds == null) {
    const err = new Error("videoId, startSeconds, endSeconds are required");
    err.status = 400;
    throw err;
  }

  if (startSeconds < 0 || endSeconds <= startSeconds) {
    const err = new Error("Invalid time range");
    err.status = 400;
    throw err;
  }

  const video = await Video.findById(videoId).select("_id duration title thumbnailUrl");
  if (!video) {
    const err = new Error("Video not found");
    err.status = 404;
    throw err;
  }

  // OPTIONAL: don't allow cut beyond video duration if you store duration
  if (video.duration && endSeconds > video.duration) {
    const err = new Error("End time exceeds video duration");
    err.status = 400;
    throw err;
  }

  const cut = await Cut.create({
    user: userId,
    video: video._id,
    title: title || video.title,
    startSeconds,
    endSeconds,
  });

  res.status(201).json({
    success: true,
    cut,
  });
});

// GET /api/cuts/my
export const getMyCuts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cuts = await Cut.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("video", "title thumbnailUrl duration owner");

  res.json({
    success: true,
    cuts,
  });
});

// OPTIONAL: delete a cut
// DELETE /api/cuts/:id
export const deleteCut = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const cut = await Cut.findOne({ _id: id, user: userId });
  if (!cut) {
    const err = new Error("Cut not found");
    err.status = 404;
    throw err;
  }

  await cut.deleteOne();

  res.json({ success: true, message: "Cut deleted" });
});
