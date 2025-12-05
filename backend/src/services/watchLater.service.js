import WatchLater from "../models/watchLater.model.js";

/**
 * Add video to watch later
 */
export const addToWatchLater = async (userId, videoId) => {
  try {
    const doc = await WatchLater.create({ userId, videoId });
    return { added: true, doc };
  } catch (err) {
    // If duplicate key error then already added
    if (err.code === 11000) {
      return { added: false, message: "Already in watch later" };
    }
    throw err;
  }
};

/**
 * Remove video from watch later
 */
export const removeFromWatchLater = async (userId, videoId) => {
  const result = await WatchLater.findOneAndDelete({ userId, videoId });
  return { removed: !!result };
};

/**
 * Get all watch later videos for user
 */
export const getWatchLaterList = async (userId) => {
  const items = await WatchLater.find({ userId })
    .sort({ createdAt: -1 })
    .populate("videoId")
    .lean();

  return items;
};
