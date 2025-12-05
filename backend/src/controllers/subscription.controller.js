import asyncHandler from "../utils/asyncHandler.js";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelSubscribers,
  getMySubscriptions,
  getChannelPageData,
  getSubscriptionFeed,
} from "../services/subscription.service.js";

export const subscribe = asyncHandler(async(req,res)=>{
    const subscriberId = req.user._id;
    const {channelId} = req.params;

    const result = await subscribeToChannel(subscriberId,channelId);
    res.json({success:true, ...result});
});

export const unsubscribe = asyncHandler(async(req,res)=>{
    const subscriberId = req.user._id;
    const {channelId} = req.params

    const result = await unsubscribeFromChannel(subscriberId,channelId);
    res.json({success:true, ...result});
});

export const mySubscriptions = asyncHandler(async( req,res)=>{
    const userId = req.user._id;
    const subs = await getMySubscriptions(userId);
    res.json({success:true,subscriptions : subs}); 
});

export const channelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subs = await getChannelSubscribers(channelId);
  res.json({ success: true, subscribers: subs });
});

export const channelPage = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;
  const data = await getChannelPageData(channelId, userId);

  if (!data) {
    return res.status(404).json({ success: false, message: "Channel not found" });
  }

  res.json({ success: true, ...data });
});

export const subscriptionFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const feed = await getSubscriptionFeed(userId, page, limit);
  res.json({ success: true, ...feed });
});