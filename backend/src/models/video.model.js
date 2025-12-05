import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoUrl: { type: String, required: true },        // CDN URL after upload
  thumbnailUrl: { type: String },
  duration: { type: Number }, // seconds
  width: Number,
  height: Number,
  size: Number, // bytes
  status: { type: String, enum: ["uploaded","processing","ready"], default: "uploaded" },
  resolutions: [{ label: String, url: String }], // optional post-transcode
  views: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
}, { timestamps: true });


// Text index for search on title + description + tags
videoSchema.index({ title: "text", description: "text", tags: "text" });

// Index for trending: often sort by views and createdAt
videoSchema.index({ views: -1, createdAt: -1 });


const Video = mongoose.model("Video", videoSchema);
export default Video;
