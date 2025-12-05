import { getEnabledCategories } from "trace_events";
import WatchParty from "../models/watchparty.model.js";
import crpto from "crypto";

//generate room code
const generateRoomCode = () => {
    return crpto.randomBytes(3).toString("hex").toUpperCase();
}

//create new watch party room

export const createWatchParty = async({hostId, videoId})=>{
    let roomCode;
    let existing;

    do{
        roomCode = generateRoomCode();
        existing = await WatchParty.findOne({roomCode});
    }
    while(existing);

     const room = await WatchParty.create({
    roomCode,
    host: hostId,
    video: videoId,
    isActive: true,
    state: {
      isPlaying: false,
      currentTime: 0,
      playbackRate: 1,
      lastUpdatedAt: new Date(),
    },
  });
  return room;
};

/**
 * Join existing room
 */
export const joinWatchParty = async ({ roomCode }) => {
  const room = await WatchParty.findOne({ roomCode, isActive: true })
    .populate("video", "title thumbnailUrl videoUrl duration")
    .populate("host", "name avatar")
    .lean();

  return room; // null if not found
};


/**
 * Get room details (for page load)
 */
export const getRoomByCode = async (roomCode) => {
  const room = await WatchParty.findOne({ roomCode, isActive: true })
    .populate("video", "title thumbnailUrl videoUrl duration")
    .populate("host", "name avatar")
    .lean();

  return room;
};


/**
 * Update playback state in DB (optional but good)
 */
export const updateRoomState = async (roomCode, state) => {
  await WatchParty.findOneAndUpdate(
    { roomCode },
    {
      state: {
        ...state,
        lastUpdatedAt: new Date(),
      },
    }
  );
};