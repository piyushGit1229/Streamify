import Video from "../models/video.model.js";
import mongoose from "mongoose";

//single video chahiye to
export const getVideoById = async (id, options = { incViews: false }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  // Fetch video + populate owner details
  const video = await Video.findById(id)
    .populate("owner", "name email avatar subscribersCount");

  if (!video) return null;

  // Increment views if needed
  if (options.incViews) {
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    video.views = (video.views || 0) + 1; 
  }

  return video;
};

//trending videos

export const getTrendingVideos = async (limit = 12) => {
  const videos = await Video.find({ status: "uploaded" })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select("title thumbnailUrl videoUrl duration owner views likesCount createdAt")
    .populate("owner", "name avatar")
    .lean();

  return videos;
};


//home feed

export const getFeed = async (page = 1,limit =12) =>{
    const skip = (page - 1) * limit;

    const videos = await Video.find({status : "ready"})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("title thumbnailUrl videoUrl duration owner views likesCount createdAt")
    .populate("owner","name avaatar")
    .lean();
    
    const total = await Video.countDocuments({status :"ready"});

    return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: videos,
  };
};


//search videos
export const searchVideos = async (q, page = 1, limit = 12) => {
    if (!q || q.trim() === "")
        return { page, limit, total: 0, totalPages: 0, data: [] };

    const skip = (page - 1) * limit;

    // 1️⃣ Attempt FULL TEXT SEARCH
    let results = await Video.find(
        {
            $text: { $search: q },
            status: { $in: ["ready", "uploaded"] }
        },
        { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("title thumbnailUrl videoUrl duration owner views likesCount createdAt")
    .populate("owner", "name avatar")
    .lean();

    // 2️⃣ If text search returns nothing → use regex fallback
    if (results.length === 0) {
        results = await Video.find({
            title: { $regex: q, $options: "i" },
            status: { $in: ["ready", "uploaded"] }
        })
        .skip(skip)
        .limit(limit)
        .populate("owner", "name avatar")
        .lean();
    }

    const total = results.length;

    return {
        success: true,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: results
    };
};


//get related videos by tags
export const getRelatedVideos = async (videoId, limit = 10) => {
    // First get the current video to find its tags
    const currentVideo = await Video.findById(videoId).select("tags");
    if (!currentVideo || !currentVideo.tags || currentVideo.tags.length === 0) {
        // If no tags, return trending videos
        return await getTrendingVideos(limit);
    }

    // Find videos with matching tags, excluding current video
    const relatedVideos = await Video.find({
        _id: { $ne: videoId },
        status: "ready",
        tags: { $in: currentVideo.tags }
    })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select("title thumbnailUrl videoUrl duration owner views likesCount createdAt")
    .populate("owner", "name avatar")
    .lean();

    // If not enough related videos, fill with trending
    if (relatedVideos.length < limit) {
        const trendingVideos = await getTrendingVideos(limit - relatedVideos.length);
        // Filter out duplicates
        const existingIds = new Set(relatedVideos.map(v => v._id.toString()));
        const additionalVideos = trendingVideos.filter(v => !existingIds.has(v._id.toString()) && v._id.toString() !== videoId);
        relatedVideos.push(...additionalVideos);
    }

    return relatedVideos.slice(0, limit);
};




    