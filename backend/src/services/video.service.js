// src/services/video.service.js
import Video from "../models/video.model.js";
import { generateThumbnailAndMetadata } from "../utils/ffmpegThumbnail.js";
import { uploadVideoToCloudinary, uploadImageToCloudinary, removeLocalFile } from "../utils/cloudinaryUpload.js";

export const processUpload = async ({ userId, file, title, description, tags }) => {
  // file: multer's file object: { path, mimetype, size, filename, ... }
  const localPath = file.path;

  // 1) Generate thumbnail & metadata
  const { thumbnailPath, duration, width, height } = await generateThumbnailAndMetadata(localPath);

  // 2) Upload video to Cloudinary (may be slow)
  const videoResp = await uploadVideoToCloudinary(localPath);

  // 3) Upload thumbnail image
  const thumbResp = await uploadImageToCloudinary(thumbnailPath);

  // 4) Persist record in DB
  const videoDoc = await Video.create({
    title: title || file.originalname,
    description: description || "",
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
    owner: userId,
    videoUrl: videoResp.secure_url,
    thumbnailUrl: thumbResp.secure_url,
    duration: duration,
    width,
    height,
    size: file.size,
    status: "uploaded"
  });

  // 5) Cleanup local files
  await removeLocalFile(localPath);
  await removeLocalFile(thumbnailPath);

  // Optional: enqueue background transcoding job here (e.g., createResolutions(videoDoc._id, videoResp.public_id) )

  return videoDoc;
};
