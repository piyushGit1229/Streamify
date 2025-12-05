import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

// 1 user cannot add the same video twice
watchLaterSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const WatchLater = mongoose.model("WatchLater", watchLaterSchema);
export default WatchLater;
