import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";

// From Your Subscriptions

export const getFromSubscriptions = async(userId,limit = 20) =>{
    const subs = await Subscription.find({ subscriber: userId }).select("channel");
    const channelIds = subs.map((s) => s.channel);

    if(channelIds.length === 0) return [];

    const videos = await Video.find({
    owner: { $in: channelIds },
    status: { $in: ["uploaded", "ready"] },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("owner", "username avatar")
    .lean();

  return videos;
};



// Trending Videos

export const getTrendingVideos = async(limit = 20)=>{
    const videos = await Video.find({
        status: { $in: ["uploaded", "ready"] }
    })
    .sort({views : -1,createdAt : -1})
    .limit(limit)
    .populate("owner","username avatar")
    .lean();
     
    return videos;
}


// Recommended For You

export const getRecommendedForUser = async(limit = 20)=>{
    const videos = await Video.find({
        status: { $in: ["uploaded", "ready"] }
    })
    .sort({ likesCount: -1, views: -1, createdAt: -1 })
    .limit(limit)
    .populate("owner", "username avatar")
    .lean();
    
    return videos;
}


//combined home feed

export const getHomeFeed = async(userId) =>{
    const [subs , trending , recommended] = await Promise.all([
        userId ? getFromSubscriptions(userId) : Promise.resolve([]),
        getTrendingVideos(),
        getRecommendedForUser()
    ]);


    return{
        fromsubsrciption : subs,
        trending,
        recommended ,
    };
};
