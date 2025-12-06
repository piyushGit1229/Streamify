import asyncHandler from "../utils/asyncHandler.js";
import {
  createWatchParty,
  joinWatchParty,
  getRoomByCode,
} from "../services/watchparty.service.js";

export const createRoom = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ success: false, message: "videoId is required" });
  }

  const room = await createWatchParty({ hostId, videoId });

  res.status(201).json({
    success: true,
    roomCode: room.roomCode,
    roomId: room._id,
  });
});

export const joinRoom = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roomCode } = req.body;

  if (!roomCode) {
    return res.status(400).json({ success: false, message: "roomCode is required" });
  }

  const room = await joinWatchParty({ roomCode, userId });

  if (!room) {
    return res
      .status(404)
      .json({ success: false, message: "Watch party not found or inactive" });
  }

  // Check if user is the host
  const isHost = room.host._id.toString() === userId.toString();

  res.json({
    success: true,
    room,
    isHost,
  });
});

export const getRoom = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { roomCode } = req.params;

  const room = await getRoomByCode(roomCode);

  if (!room) {
    return res
      .status(404)
      .json({ success: false, message: "Watch party not found or inactive" });
  }

  // Check if user is the host
  const isHost = room.host._id.toString() === userId.toString();

  res.json({
    success: true,
    room,
    isHost,
  });
});
