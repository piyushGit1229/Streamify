import { useState, useEffect, useRef } from "react";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import { useAuthStore } from "../../store/authStore";
import { FiMessageSquare, FiSend } from "react-icons/fi";

function WatchPartyChat({ roomCode }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomCode || !user) return;

    // Join the watch party room
    watchpartySocket.joinRoom(roomCode, user.name);

    // Listen for chat messages
    const handleChatMessage = (message) => {
      const isOwn = message.username === user.name;
      setMessages((prev) => [...prev, {
        id: Date.now() + Math.random(),
        username: message.username,
        message: message.message,
        at: message.at,
        isOwn
      }]);
    };

    watchpartySocket.onChatMessage(handleChatMessage);

    return () => {
      // Cleanup listeners
      watchpartySocket.offChatMessage(handleChatMessage);
      watchpartySocket.leaveRoom(roomCode);
    };
  }, [roomCode, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    watchpartySocket.sendMessage(roomCode, input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-md">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FiMessageSquare size={18} className="text-blue-400" />
          Chat ({messages.length})
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'justify-end' : ''}`}>
              {!msg.isOwn && (
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-semibold">
                  {msg.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className={`max-w-[70%] ${msg.isOwn ? 'order-first' : ''}`}>
                {!msg.isOwn && (
                  <p className="text-[10px] text-gray-400 mb-1">{msg.username}</p>
                )}
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.isOwn
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-blue-500/20 text-white rounded-bl-md backdrop-blur-sm border border-blue-500/30'
                }`}>
                  {msg.message}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {new Date(msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-500/20 bg-gradient-to-r from-blue-900/10 to-purple-900/10 backdrop-blur-md">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 bg-blue-500/20 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300/70 border border-blue-500/30 backdrop-blur-sm"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1"
            type="submit"
            disabled={!input.trim()}
          >
            <FiSend size={14} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default WatchPartyChat;   // <-- FIXED!
