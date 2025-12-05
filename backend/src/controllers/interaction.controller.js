import asyncHandler from "../utils/asyncHandler.js";
import {
    toggleLike,
    toggleDislike,
    getLikedVideos,
    getDislikedVideos
} from "../services/interaction.service.js";



export const likeVideo = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {videoId}  = req.params;

    const result = await toggleLike(userId,videoId);
    res.json({success:true, ...result});
});

export const dislikeVideo = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {videoId}  = req.params;

    const result = await toggleDislike(userId,videoId);
    res.json({success:true, ...result});    
});

export const myLikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const result = await getLikedVideos(userId);
    res.json({success:true, ...result});
});

export const myDislikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const videos = await getDislikedVideos(userId);
    res.json({success:true, videos});   
});

