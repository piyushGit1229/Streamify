// src/controllers/video.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import * as videoService from "../services/video.service.js";
import Interaction from "../models/interaction.model.js";
import Subscription from "../models/subscription.model.js";

import {
  getVideoById,
  getTrendingVideos,
  getFeed,
  searchVideos,
  getRelatedVideos,
} from "../services/videoQuery.service.js";

export const uploadVideo = asyncHandler(async (req, res) => {
  // req.file from multer, req.user from auth middleware
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file provided" });

  const { title, description, tags } = req.body;
  const userId = req.user._id; // ensure auth middleware sets req.user

  const video = await videoService.processUpload({ userId, file, title, description, tags });

  res.status(201).json({
    message: "Video uploaded",
    video: {
      id: video._id,
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration
    }
  });
});

//get single video by id using videoqueryservice
export const getVideo = asyncHandler(async (req, res) => {
  const inc = req.query.inc === "true";
  let video = await getVideoById(req.params.id, { incViews: inc });

  if (!video) return res.status(404).json({ error: "Video not found" });

  // ---------------------------------------------
  // ADD USER-SPECIFIC LIKE/DISLIKE STATE (if user is authenticated)
  // ---------------------------------------------
  if (req.user && req.user._id) {
    const interaction = await Interaction.findOne({
      userId: req.user._id,
      videoId: video._id
    });

    video.isLiked = interaction?.status === "like";
    video.isDisliked = interaction?.status === "dislike";

    // ---------------------------------------------
    // SAFETY CHECK BEFORE ACCESSING video.owner._id
    // ---------------------------------------------
    if (!video.owner || !video.owner._id) {
      console.log("⚠️ video.owner missing or not populated");
      video.isSubscribed = false; // safe fallback
    } else {
      const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: video.owner._id
      });

      video.isSubscribed = !!subscription;
    }
  } else {
    // No user, set defaults
    video.isLiked = false;
    video.isDisliked = false;
    video.isSubscribed = false;
  }

  // ---------------------------------------------
  res.status(200).json({ success: true, video });
});

// Get trending videos
export const trending = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 12;
  const videos = await getTrendingVideos(limit);
  res.status(200).json({success : true,videos});
})


// Get user feed
export const feed = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 12;
  const result = await getFeed(page, limit);
  res.json({ success: true, ...result });
});

export const relatedVideos = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const videos = await getRelatedVideos(videoId);
  res.status(200).json({ success: true, videos });
});

//search video
export const search = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const page = req.query.page || 1;
  const limit = req.query.limit || 12;
  const result = await searchVideos(q, page, limit);
  res.json({ success: true, ...result });
})





