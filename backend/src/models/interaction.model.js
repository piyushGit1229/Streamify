import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    status: {
        type: String,
        enum: ["like", "dislike"],//ENUM types enforce data integrity by ensuri
        required: true
    },
},
{ timestamps: true }
);

//ensure only one interaction per video
interactionSchema.index({ videoId: 1, userId: 1 }, { unique: true });

const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction;