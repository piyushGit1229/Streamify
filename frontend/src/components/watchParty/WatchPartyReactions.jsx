import { useState, useEffect, useRef } from "react";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import { useAuthStore } from "../../store/authStore";

// ✅ IMPORT ALL REQUIRED ICONS
import {
  FiSmile,
  FiMeh,
  FiFrown,
  FiThumbsUp,
  FiThumbsDown,
  FiHeart,
  FiZap,
} from "react-icons/fi";

export default function WatchPartyReactions({ roomCode }) {
  const { user } = useAuthStore();
  const [reactions, setReactions] = useState({});
  const timeoutRefs = useRef({});

  const reactionEmojis = [
    { emoji: "laugh", icon: FiSmile, label: "Laugh" },
    { emoji: "wow", icon: FiMeh, label: "Wow" },
    { emoji: "sad", icon: FiFrown, label: "Sad" },
    { emoji: "angry", icon: FiFrown, label: "Angry" },
    { emoji: "like", icon: FiThumbsUp, label: "Like" },
    { emoji: "dislike", icon: FiThumbsDown, label: "Dislike" },
    { emoji: "love", icon: FiHeart, label: "Love" },
    { emoji: "fire", icon: FiZap, label: "Fire" },
  ];

  useEffect(() => {
    if (!roomCode || !user) return;

    watchpartySocket.joinRoom(roomCode, user.name);

    const handleReaction = (reaction) => {
      const emoji = reaction.emoji;

      setReactions((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1,
      }));

      if (timeoutRefs.current[emoji]) {
        clearTimeout(timeoutRefs.current[emoji]);
      }

      timeoutRefs.current[emoji] = setTimeout(() => {
        setReactions((prev) => ({
          ...prev,
          [emoji]: Math.max(0, (prev[emoji] || 0) - 1),
        }));
        delete timeoutRefs.current[emoji];
      }, 3000);
    };

    watchpartySocket.onReaction(handleReaction);

    return () => {
      watchpartySocket.offReaction(handleReaction);
      watchpartySocket.leaveRoom(roomCode);

      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};
    };
  }, [roomCode, user]);

  const handleReactionClick = (emoji) => {
    watchpartySocket.sendReaction(roomCode, emoji);

    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    if (timeoutRefs.current[emoji]) {
      clearTimeout(timeoutRefs.current[emoji]);
    }

    timeoutRefs.current[emoji] = setTimeout(() => {
      setReactions((prev) => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1),
      }));
      delete timeoutRefs.current[emoji];
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {reactionEmojis.map(({ emoji, icon: Icon, label }) => (
        <button
          key={emoji}
          onClick={() => handleReactionClick(emoji)}
          className="relative group px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-blue-500/20"
          title={label}
        >
          <Icon size={20} className="text-blue-400" />

          {reactions[emoji] > 0 && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {reactions[emoji]}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
