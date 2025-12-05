import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import mongoose from "mongoose";


//subscribe to a channel
export const subscribeToChannel = async (subscriberId, channelId) => {
  if (subscriberId.toString() === channelId.toString())
    return { success: false, message: "You cannot subscribe to yourself" };

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  // 💥 If already subscribed, do NOT throw error — return correct state
  if (existing) {
    const count = await Subscription.countDocuments({ channel: channelId });

    return {
      success: true,
      isSubscribed: true,
      subscriberCount: count,
      message: "Already subscribed",
    };
  }

  // NEW SUBSCRIPTION
  await Subscription.create({ subscriber: subscriberId, channel: channelId });

  await User.findByIdAndUpdate(channelId, {
    $inc: { subscribersCount: 1 },
  });

  await User.findByIdAndUpdate(subscriberId, {
    $inc: { subscrptionsCount: 1 },
  });

  const count = await Subscription.countDocuments({ channel: channelId });

  return {
    success: true,
    isSubscribed: true,
    subscriberCount: count,
    message: "Subscribed successfully",
  };
};

//unsubscribe from a channel
export const unsubscribeFromChannel = async (subscriberId, channelId) => {
  const result = await Subscription.findOneAndDelete({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (!result) {
    const count = await Subscription.countDocuments({ channel: channelId });

    return {
      success: true,
      isSubscribed: false,
      subscriberCount: count,
      message: "Not subscribed",
    };
  }

  await User.findByIdAndUpdate(channelId, {
    $inc: { subscribersCount: -1 },
  });

  await User.findByIdAndUpdate(subscriberId, {
    $inc: { subscriptionsCount: -1 },
  });

  const count = await Subscription.countDocuments({ channel: channelId });

  return {
    success: true,
    isSubscribed: false,
    subscriberCount: count,
    message: "Unsubscribed successfully",
  };
};



//get channel subscribers list

export const getChannelSubscribers = async(channelId)=>{
const subs = await Subscription.find({ channel: channelId })
    .populate("subscriber", "name avatar email")
    .lean();

  return subs;
}


//get channels current user subsribed to

export const getMySubscriptions = async(userId)=>{
    const subs = await Subscription.find({ subscriber: userId })
    .populate("channel", "name avatar channelDescription subscribersCount")
    .lean();
  
    return subs;
};


/**
 * Get channel page data:
 * - channel info
 * - stats
 * - list of videos (basic info)
 * - isSubscribed (for current user)
 */

export const getChannelPageData = async(channelId, userId)=>{
    if(!mongoose.isValidObjectId(channelId)){
        throw new Error("Invalid channel id");
    }

    const channel = await User.findById(channelId)
    .select("name email avatar channelDescription channelBanner subscribersCount createdAt")
    .lean();

    if(!channel) return null;

    const videos = await Video.find({owner:channelId , status:"uploaded"})
    .sort({createdAt : -1})
    .select("title thumbnailUrl duration views likesCount createdAt")
    .lean();


    //total views of channel
    const stats = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
      },
    },
  ]);

  const totalViews = stats[0]?.totalViews || 0;
  const totalVideos = stats[0]?.totalVideos || 0;

  // Check if current user is subscribed
  const isSubscribed = userId ? !!(await Subscription.findOne({ subscriber: userId, channel: channelId })) : false;

  return {
    channel: {
      ...channel,
      isSubscribed,
    },
    videos,
    stats: {
      totalViews,
      totalVideos,
      subscribersCount: channel.subscribersCount || 0,
    },
  };
}

/**
 * Subscription feed - videos from channels the user subscribed to
 */

export const getSubscriptionFeed = async (userId, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;

  // find which channels user subscribed to
  const subscriptions = await Subscription.find({ subscriber: userId }).select("channel");
  const channelIds = subscriptions.map((s) => s.channel);

  if (channelIds.length === 0) {
    return { page, limit, total: 0, totalPages: 0, data: [] };
  }

  const query = { owner: { $in: channelIds }};

  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("title thumbnailUrl duration owner views likesCount createdAt")
    .populate("owner", "name avatar")
    .lean();

  const total = await Video.countDocuments(query);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: videos,
  };
};