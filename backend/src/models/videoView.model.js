import mongoose from "mongoose";

const videoViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  viewedAt: { type: Date, default: Date.now }
});

export default mongoose.model("VideoView", videoViewSchema);
