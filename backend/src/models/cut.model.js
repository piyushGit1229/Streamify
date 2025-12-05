import mongoose from "mongoose";

const cutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    startSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    endSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Cut = mongoose.model("Cut", cutSchema);
export default Cut;
