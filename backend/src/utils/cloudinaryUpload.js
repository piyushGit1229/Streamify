// src/utils/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js"; // see below
import fs from "fs/promises";

export const uploadVideoToCloudinary = async (filePath) => {
  // resource_type 'video' ensures cloudinary treats it as video
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    folder: "streamify/videos",
    // eager: [ { width: 640, height: 360, crop: "pad" } ] // optional transformations
  });
  return result; // contains secure_url, public_id, duration, bytes, etc.
};

export const uploadImageToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "streamify/thumbnails"
  });
  return result;
};


export const uploadprofile = async(filePath)=>{
  const res = await cloudinary.uploader.upload(filePath, {
    folder: "streamify/profile",
    resource_type: "image"
  });
  return res.secure_url;
}

// helper to delete local temp file
export const removeLocalFile = async (path) => {
  try { await fs.unlink(path); } catch(e) { /* ignore */ }
};
