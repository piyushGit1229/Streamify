import { useState, useEffect, useRef } from "react";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import { useAuthStore } from "../../store/authStore";
import { FiMessageSquare, FiUsers, FiSend } from "react-icons/fi";

const EMOJI_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"];

export default function WatchPartySidebar({ roomCode, room }) {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState([]);
  const [floatingEmoji, setFloatingEmoji] = useState(null);

  const messagesEndRef = useRef(null);

  // ==========================================================
  // SOCKET CONNECTION
  // ==========================================================
  useEffect(() => {
    if (!roomCode || !user || !room) return;

    const initial = [];

    if (user._id !== room.host?._id) {
      initial.push({
        id: user._id,
        username: user.name,
        avatar: user.avatar,
        isHost: false,
        isOnline: true,
      });
    }

    setParticipants(initial);

    watchpartySocket.joinRoom(roomCode, user.name, user._id);

    const handleChatMessage = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          id: Date.now() + Math.random(),
          isOwn: msg.username === user.name,
        },
      ]);
    };

    const handleEmojiReaction = (reaction) => {
      setFloatingEmoji({
        emoji: reaction.emoji,
        x: Math.random() * 120 + 50,
        y: Math.random() * 120 + 50,
        id: Date.now(),
      });

      setTimeout(() => setFloatingEmoji(null), 1200);
    };

    const handleUserJoined = (u) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.id === u.id)) {
          return prev.map((p) =>
            p.id === u.id ? { ...p, isOnline: true } : p
          );
        }
        return [...prev, { ...u, isOnline: true }];
      });
    };

    const handleUserLeft = (u) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === u.id ? { ...p, isOnline: false } : p
        )
      );
    };

    watchpartySocket.onChatMessage(handleChatMessage);
    watchpartySocket.onEmojiReaction(handleEmojiReaction);
    watchpartySocket.onUserJoined(handleUserJoined);
    watchpartySocket.onUserLeft(handleUserLeft);

    return () => {
      watchpartySocket.leaveRoom(roomCode);
      watchpartySocket.offChatMessage(handleChatMessage);
      watchpartySocket.offEmojiReaction(handleEmojiReaction);
      watchpartySocket.offUserJoined(handleUserJoined);
      watchpartySocket.offUserLeft(handleUserLeft);
    };
  }, [roomCode, user, room]);

  // SCROLL ALWAYS TO LATEST MESSAGE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================================
  // ACTION HANDLERS
  // ==========================================================
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    watchpartySocket.sendMessage(roomCode, input.trim());
    setInput("");
  };

  const sendEmojiReaction = (emoji) => {
    watchpartySocket.sendEmojiReaction(roomCode, emoji);
  };

  // =======================================================================
  // RETURN SIDEBAR UI
  // =======================================================================
  return (
    <div className="w-80 bg-[#0f0f0f] border-l border-white/10 flex flex-col min-h-0 relative">

      {/* FLOATING EMOJI */}
      {floatingEmoji && (
        <div
          className="absolute text-4xl z-50 animate-bounce pointer-events-none"
          style={{
            left: floatingEmoji.x,
            top: floatingEmoji.y,
            animation: "float-up 1.2s ease-out forwards",
          }}
        >
          {floatingEmoji.emoji}
        </div>
      )}

      {/* TAB BAR */}
      <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
            activeTab === "chat"
              ? "text-white border-b-2 border-blue-500 bg-white/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiMessageSquare size={16} /> Chat
        </button>

        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
            activeTab === "participants"
              ? "text-white border-b-2 border-blue-500 bg-white/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiUsers size={16} /> Participants
        </button>
      </div>

      {/* ========================== CHAT TAB ========================== */}
      {activeTab === "chat" && (
        <div className="flex flex-col flex-1 min-h-0">

          {/* MESSAGE LIST (scrollable fixed area) */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-6">
                No messages yet...
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isOwn ? "justify-end" : ""}`}
                >
                  {!msg.isOwn && (
                    <img
                      src={
                        msg.avatar ||
                        `https://ui-avatars.com/api/?name=${msg.username}&background=555&color=fff`
                      }
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className={`max-w-[70%] ${msg.isOwn ? "text-right" : ""}`}>
                    {!msg.isOwn && (
                      <p className="text-xs text-gray-400">{msg.username}</p>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        msg.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white backdrop-blur-md"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(msg.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* EMOJI BAR */}
          <div className="px-3 py-2 border-t border-white/10 bg-black/20 flex gap-2 overflow-x-auto">
            {EMOJI_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendEmojiReaction(emoji)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* MESSAGE INPUT */}
          <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                className="flex-1 bg-white/10 px-4 py-2 rounded-full text-white placeholder-gray-400 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                disabled={!input.trim()}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================== PARTICIPANTS TAB ========================== */}
      {activeTab === "participants" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* HOST */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3 items-center">
            <img
              src={
                room.host?.avatar ||
                `https://ui-avatars.com/api/?name=${room.host?.name}&background=ff4444&color=fff`
              }
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-semibold">{room.host?.name}</p>
              <p className="text-xs text-red-400 font-medium">Host</p>
            </div>
          </div>

          {/* OTHER USERS */}
          {participants.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3 items-center"
            >
              <img
                src={
                  p.avatar ||
                  `https://ui-avatars.com/api/?name=${p.username}&background=555&color=fff`
                }
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{p.username}</p>
                <p
                  className={`text-xs ${
                    p.isOnline ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {p.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}

          {participants.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-6">
              No participants yet...
            </p>
          )}
        </div>
      )}

      {/* FLOAT-UP ANIMATION */}
      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
