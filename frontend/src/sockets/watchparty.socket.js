import { getSocket } from "../config/socket";

const socket = getSocket();

// WatchParty Socket Functions
export const watchpartySocket = {
  // Join a watch party room
  joinRoom: (roomCode, username, userId) => {
    socket.emit("watchparty:join", { roomCode, username, userId });
  },

  // Leave a watch party room
  leaveRoom: (roomCode) => {
    socket.emit("watchparty:leave", { roomCode });
  },

  // Video control events
  play: (roomCode, currentTime, playbackRate) => {
    socket.emit("watchparty:play", { roomCode, currentTime, playbackRate });
  },

  pause: (roomCode, currentTime, playbackRate) => {
    socket.emit("watchparty:pause", { roomCode, currentTime, playbackRate });
  },

  seek: (roomCode, currentTime, playbackRate, isPlaying) => {
    socket.emit("watchparty:seek", { roomCode, currentTime, playbackRate, isPlaying });
  },

  // Chat events
  sendMessage: (roomCode, message) => {
    socket.emit("watchparty:chat", { roomCode, message });
  },

  // Reaction events
  sendReaction: (roomCode, emoji) => {
    socket.emit("watchparty:reaction", { roomCode, emoji });
  },

  sendEmojiReaction: (roomCode, emoji) => {
    socket.emit("watchparty:emoji-reaction", { roomCode, emoji });
  },

  addMessageReaction: (roomCode, messageId, emoji) => {
    socket.emit("watchparty:message-reaction", { roomCode, messageId, emoji });
  },

  // Event listeners
  onStateChange: (callback) => {
    socket.on("watchparty:state", callback);
  },

  onInitialState: (callback) => {
    socket.on("watchparty:initial-state", callback);
  },

  onChatMessage: (callback) => {
    socket.on("watchparty:chat", callback);
  },

  onReaction: (callback) => {
    socket.on("watchparty:reaction", callback);
  },

  onUserJoined: (callback) => {
    socket.on("watchparty:user-joined", callback);
  },

  onUserLeft: (callback) => {
    socket.on("watchparty:user-left", callback);
  },

  onEmojiReaction: (callback) => {
    socket.on("watchparty:emoji-reaction", callback);
  },

  // Cleanup listeners
  offStateChange: (callback) => {
    socket.off("watchparty:state", callback);
  },

  offInitialState: (callback) => {
    socket.off("watchparty:initial-state", callback);
  },

  offChatMessage: (callback) => {
    socket.off("watchparty:chat", callback);
  },

  offReaction: (callback) => {
    socket.off("watchparty:reaction", callback);
  },

  offUserJoined: (callback) => {
    socket.off("watchparty:user-joined", callback);
  },

  offUserLeft: (callback) => {
    socket.off("watchparty:user-left", callback);
  },

  offEmojiReaction: (callback) => {
    socket.off("watchparty:emoji-reaction", callback);
  },

  // Get raw socket instance if needed
  getSocket: () => socket,
};
