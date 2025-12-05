import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

/* ---------------------------------------------------
   GET PROFILE
--------------------------------------------------- */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "name email avatar channelBanner channelDescription createdAt subscribersCount subscriptionsCount"
  );

  res.json({
    success: true,
    user
  });
});


/* ---------------------------------------------------
   UPDATE NAME + CHANNEL DESCRIPTION
--------------------------------------------------- */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, channelDescription } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, channelDescription },
    { new: true }
  ).select("-password -refreshTokens");

  res.json({
    success: true,
    user
  });
});


/* ---------------------------------------------------
   UPDATE AVATAR (Base64 Upload)
--------------------------------------------------- */
export const updateAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).json({ success: false, message: "Avatar file missing" });
  }

  const uploaded = await cloudinary.uploader.upload(avatar, {
    folder: "streamify/avatars"
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploaded.secure_url },
    { new: true }
  ).select("-password -refreshTokens");

  res.json({
    success: true,
    avatar: user.avatar
  });
});


/* ---------------------------------------------------
   UPDATE BANNER (Base64 Upload)
--------------------------------------------------- */
export const updateBanner = asyncHandler(async (req, res) => {
  const { banner } = req.body;

  if (!banner) {
    return res.status(400).json({ success: false, message: "Banner file missing" });
  }

  const uploaded = await cloudinary.uploader.upload(banner, {
    folder: "streamify/banners"
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { channelBanner: uploaded.secure_url },
    { new: true }
  ).select("-password -refreshTokens");

  res.json({
    success: true,
    banner: user.channelBanner
  });
});
