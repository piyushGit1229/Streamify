// src/sockets/watchparty.socket.js
import { updateRoomState } from "../services/watchparty.service.js";

// In-memory state cache (for fast real-time sync)
// For true horizontal scale, you would use Redis instead
const roomStates = new Map(); // roomCode -> { isPlaying, currentTime, playbackRate }

export const registerWatchPartyHandlers = (io, socket) => {
  // Client sends: { roomCode, username }
  socket.on("watchparty:join", ({ roomCode, username }) => {
    if (!roomCode) return;

    socket.join(roomCode);
    socket.data.username = username || "Guest";

    console.log(`${socket.id} joined room ${roomCode}`);

    // Notify others
    socket.to(roomCode).emit("watchparty:user-joined", {
      username: socket.data.username,
      id: socket.id,
    });

    // Send current state to the newly joined user (if exists)
    const currentState = roomStates.get(roomCode);
    if (currentState) {
      socket.emit("watchparty:initial-state", currentState);
    }
  });

  socket.on("watchparty:leave", ({ roomCode }) => {
    socket.leave(roomCode);
    socket.to(roomCode).emit("watchparty:user-left", {
      username: socket.data.username,
      id: socket.id,
    });
  });

  // Host triggers PLAY
  socket.on("watchparty:play", async ({ roomCode, currentTime, playbackRate }) => {
    if (!roomCode) return;

    const newState = {
      isPlaying: true,
      currentTime: currentTime || 0,
      playbackRate: playbackRate || 1,
    };

    roomStates.set(roomCode, newState);
    updateRoomState(roomCode, newState).catch(() => {});

    io.to(roomCode).emit("watchparty:state", {
      ...newState,
      updatedBy: socket.data.username,
      type: "play",
    });
  });

  // Host triggers PAUSE
  socket.on("watchparty:pause", async ({ roomCode, currentTime, playbackRate }) => {
    if (!roomCode) return;

    const newState = {
      isPlaying: false,
      currentTime: currentTime || 0,
      playbackRate: playbackRate || 1,
    };

    roomStates.set(roomCode, newState);
    updateRoomState(roomCode, newState).catch(() => {});

    io.to(roomCode).emit("watchparty:state", {
      ...newState,
      updatedBy: socket.data.username,
      type: "pause",
    });
  });

  // Host triggers SEEK
  socket.on("watchparty:seek", async ({ roomCode, currentTime, playbackRate }) => {
    if (!roomCode) return;

    const newState = {
      isPlaying: false,
      currentTime: currentTime || 0,
      playbackRate: playbackRate || 1,
    };

    roomStates.set(roomCode, newState);
    updateRoomState(roomCode, newState).catch(() => {});

    io.to(roomCode).emit("watchparty:state", {
      ...newState,
      updatedBy: socket.data.username,
      type: "seek",
    });
  });

  // Chat message
  socket.on("watchparty:chat", ({ roomCode, message }) => {
    if (!roomCode || !message) return;

    const payload = {
      username: socket.data.username,
      message,
      at: new Date().toISOString(),
    };

    io.to(roomCode).emit("watchparty:chat", payload);
  });

  // Reaction (emoji)
  socket.on("watchparty:reaction", ({ roomCode, emoji }) => {
    if (!roomCode || !emoji) return;

    const payload = {
      username: socket.data.username,
      emoji,
      at: new Date().toISOString(),
    };

    io.to(roomCode).emit("watchparty:reaction", payload);
  });

  // Cleanup on disconnect
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach((roomCode) => {
      socket.to(roomCode).emit("watchparty:user-left", {
        username: socket.data.username,
        id: socket.id,
      });
    });
  });
};
