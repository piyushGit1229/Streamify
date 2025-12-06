import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWatchPartyRoom } from "../../api/watchPartyApi";
import { useAuthStore } from "../../store/authStore";

import WatchPartyVideo from "../../components/watchParty/WatchPartyVideo";
import WatchPartyHeader from "../../components/watchParty/WatchPartyHeader";
import WatchPartySidebar from "../../components/watchParty/WatchPartySidebar";

export default function WatchPartyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [room, setRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // FETCH WATCH PARTY ROOM
  // =====================================================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await getWatchPartyRoom(roomCode);

        if (response?.room) {
          setRoom(response.room);
          setIsHost(response.isHost || false);
        } else {
          setError("Watch party not found.");
        }
      } catch (err) {
        setError("Unable to load watch party.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomCode]);

  // =====================================================
  // LOADING SCREEN
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="opacity-70">Loading Watch Party...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================
  if (error || !room) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Watch Party Not Found</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* HEADER */}
      <WatchPartyHeader room={room} />

      {/* CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* ================= VIDEO SECTION ================= */}
        <div className="flex-1 flex flex-col bg-[#050505]">

          {/* PUSH VIDEO UP A LITTLE FOR PERFECT LOOK */}
          <div className="flex-1 px-4 pt-3 pb-2 flex">
            <div className="flex-1 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <WatchPartyVideo room={room} isHost={isHost} />
            </div>
          </div>

        </div>

        {/* ================= SIDEBAR SECTION ================= */}
        <div className="w-[350px] bg-[#0b0c10]/90 border-l border-white/10 backdrop-blur-xl shadow-xl">
          <WatchPartySidebar roomCode={roomCode} room={room} />
        </div>

      </div>
    </div>
  );
}
