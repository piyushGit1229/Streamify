import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiShare2, FiClipboard, FiCheck } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import toast from "react-hot-toast";

function WatchPartyHeader({ room }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [participants, setParticipants] = useState([]);
  const [copied, setCopied] = useState(false);

  const hostName = room?.hostName || user?.name || "Host";

  useEffect(() => {
    if (!room?.roomCode || !user) return;

    const initialParticipants = [
      {
        id: user._id,
        username: user.name,
        avatar: user.avatar,
        isOnline: true,
      },
    ];

    setParticipants(initialParticipants);

    watchpartySocket.joinRoom(room.roomCode, user.name);

    const handleUserJoined = (data) => {
      setParticipants((prev) => {
        const existing = prev.find((p) => p.id === data.id);
        if (existing) {
          return prev.map((p) =>
            p.id === data.id ? { ...p, isOnline: true } : p
          );
        }
        return [...prev, { ...data, isOnline: true }];
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
    };
  }, [room?.roomCode, user]);

  const handleLeaveParty = () => navigate("/");

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room?.roomCode || "");
      setCopied(true);
      toast.success("Room code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy room code");
    }
  };

  const displayedParticipants = participants.slice(0, 3);
  const remaining = participants.length - 3;

  return (
    <div
      className="
        h-20 w-full px-6
        flex items-center justify-between
        bg-[#0F0F14]
        border-b border-white/10
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-6">

        {/* Streamify Logo */}
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 rounded-lg 
            bg-blue-500 
            flex items-center justify-center 
            shadow-md
          ">
            <svg width="18" height="18" fill="white">
              <polygon points="0,0 18,9 0,18" />
            </svg>
          </div>

          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              Streamify
            </h1>
            <p className="text-sm text-gray-400 -mt-1">
              Hosted by <span className="text-blue-400">{hostName}</span>
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="border-l border-white/10 pl-6">
          <h2 className="text-md font-semibold text-white">
            {room?.title || "Watch Party"}
          </h2>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* ROOM CODE */}
        <button
          onClick={copyRoomCode}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-full
            bg-[#1A1A22]
            text-gray-200 
            border border-white/10
            hover:bg-[#22222c]
            transition-all
          "
        >
          <span className="font-mono text-sm">{room?.roomCode}</span>
          {copied ? (
            <FiCheck size={14} className="text-green-400" />
          ) : (
            <FiClipboard size={14} className="text-gray-400" />
          )}
        </button>

        {/* PARTICIPANTS */}
        <div className="flex items-center -space-x-2">
          {displayedParticipants.map((p, i) => (
            <div
              key={p.id}
              className="
                relative w-9 h-9 rounded-full overflow-hidden 
                border-2 border-[#0F0F14]
                shadow
              "
              style={{ zIndex: 10 - i }}
            >
              <img
                src={p.avatar || "https://i.pravatar.cc/40"}
                className="w-full h-full object-cover"
              />
              <span
                className={`
                  absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white
                  ${p.isOnline ? "bg-green-500" : "bg-gray-500"}
                `}
              />
            </div>
          ))}

          {remaining > 0 && (
            <div className="
              w-9 h-9 rounded-full 
              bg-[#1A1A22]
              border-2 border-[#0F0F14]
              text-white text-xs flex items-center justify-center
            ">
              +{remaining}
            </div>
          )}
        </div>

        {/* INVITE + LEAVE BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              border border-blue-500/30
              transition
            "
          >
            <FiShare2 size={16} /> Invite
          </button>

          <button
            onClick={handleLeaveParty}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-red-600/20 text-red-300 
              border border-red-500/30
              hover:bg-red-600/30
              transition
            "
          >
            <FiLogOut size={16} /> Leave Party
          </button>
        </div>
      </div>
    </div>
  );
}

export default WatchPartyHeader;
