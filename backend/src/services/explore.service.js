import Video from "../models/video.model.js";
import User from "../models/user.model.js";

export const getExploreFeed = async () => {

  const trending = await Video.find({ status: "uploaded" })
    .sort({ views: -1 })
    .limit(12)
    .populate("owner", "name avatar");

  const topMusic = await Video.find({ tags: { $in: ["music", "song"] } })
    .sort({ views: -1 })
    .limit(12)
    .populate("owner", "name avatar");

  const tech = await Video.find({ tags: { $in: ["tech", "coding", "programming"] } })
    .limit(12)
    .populate("owner", "name avatar");

  const gaming = await Video.find({ tags: { $in: ["gaming", "game"] } })
    .limit(12)
    .populate("owner", "name avatar");

  const recent = await Video.find({ status: "uploaded" })
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("owner", "name avatar");

  const popularChannels = await User.find()
    .sort({ subscribersCount: -1 })
    .limit(10)
    .select("name avatar subscribersCount");

  return {
    trending,
    topMusic,
    tech,
    gaming,
    education: [], // You can fill later
    recent,
    popularChannels
  };
};
