import mongoose from "mongoose";

const watchPartySchema = new mongoose.Schema(
    {
        roomCode:{
            type:String,
            required:true,
            unique:true,
            index : true,
        },

        host:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
            required:true
        },

        isActive:{
            type:Boolean,
            default:true,
        },

      state: {
      isPlaying: { type: Boolean, default: false },
      currentTime: { type: Number, default: 0 }, // seconds
      playbackRate: { type: Number, default: 1 },
      lastUpdatedAt: { type: Date, default: Date.now },
    },
        
    },
    {timestamps:true}
);

const watchParty = mongoose.model("WatchParty", watchPartySchema);
export default watchParty;