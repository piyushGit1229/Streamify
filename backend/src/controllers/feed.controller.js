import asyncHandler from "../utils/asyncHandler.js";
import { getHomeFeed } from "../services/feed.service.js";

export const homeFeed = asyncHandler(async(req,res)=>{
    const userId = req.user ? req.user._id : null;

    const feed = await getHomeFeed(userId);

    res.json({success:true,...feed});
})
