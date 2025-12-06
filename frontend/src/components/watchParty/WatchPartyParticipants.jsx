import { useEffect, useState } from "react";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import { useAuthStore } from "../../store/authStore";
import { FiUsers } from "react-icons/fi";

export default function WatchPartyParticipants({ roomCode, room }) {
  const { user } = useAuthStore();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!roomCode || !user || !room) return;

    const initial = [];

    // Add self (if not the host)
    if (user._id !== room.host?._id) {
      initial.push({
        id: user._id,
        username: user.name,
        avatar: user.avatar,
        isHost: false,
        isOnline: true,
        joinedAt: new Date(),
      });
    }

    // Add host manually
    if (room.host) {
      initial.unshift({
        id: room.host._id,
        username: room.host.name,
        avatar: room.host.avatar,
        isHost: true,
        isOnline: true,
        joinedAt: new Date(),
      });
    }

    setParticipants(initial);

    watchpartySocket.joinRoom(roomCode, user.name);

    const handleUserJoined = (data) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === data.id);
        if (exists) {
          return prev.map((p) =>
            p.id === data.id ? { ...p, isOnline: true } : p
          );
        }
        return [
          ...prev,
          {
            id: data.id,
            username: data.username,
            avatar: null,
            isHost: false,
            isOnline: true,
            joinedAt: new Date(),
          },
        ];
      });
    };

    const handleUserLeft = (data) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === data.id ? { ...p, isOnline: false } : p
        )
      );
    };

    watchpartySocket.onUserJoined(handleUserJoined);
    watchpartySocket.onUserLeft(handleUserLeft);

    return () => {
      watchpartySocket.offUserJoined(handleUserJoined);
      watchpartySocket.offUserLeft(handleUserLeft);
      watchpartySocket.leaveRoom(roomCode);
    };
  }, [roomCode, user]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="
        p-4 
        bg-[#11121A]/60 
        border-b border-white/10 
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.2)]
      ">
        <h3 className="font-semibold text-white flex items-center gap-2 tracking-wide">
          <FiUsers className="text-blue-400" size={18} />
          Participants <span className="text-gray-400 text-sm">({participants.length})</span>
        </h3>
      </div>

      {/* PARTICIPANT LIST */}
      <div className="p-4 overflow-y-auto space-y-3 custom-scroll">

        {participants.map((p) => (
          <div
            key={p.id}
            className="
              flex items-center gap-3 p-3 rounded-xl 
              bg-[#1A1C24]/40 
              backdrop-blur-lg 
              border border-white/10 
              hover:bg-[#232530]/50 
              transition-all shadow-md
            "
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={p.avatar || `https://i.pravatar.cc/40?u=${p.id}`}
                alt={p.username}
                className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-md"
              />
              <span
                className={`
                  absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#0F0F14]
                  ${p.isOnline ? "bg-green-500" : "bg-gray-500"}
                `}
              />
            </div>

            {/* NAME + STATUS */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">
                  {p.username}
                </span>

                {p.isHost && (
                  <span className="
                    text-[10px] 
                    px-2 py-0.5 
                    rounded-full 
                    font-semibold 
                    bg-red-600/20 
                    text-red-400 
                    border border-red-500/30
                  ">
                    HOST
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-0.5">
                {p.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
