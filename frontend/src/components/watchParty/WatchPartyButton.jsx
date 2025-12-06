import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { createWatchParty, joinWatchParty } from "../../api/watchPartyApi";
import { FiUsers, FiPlusCircle, FiLogIn, FiX } from "react-icons/fi";

export default function WatchPartyButton({ videoId }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  // ----------------------------
  // Close dropdown on outside click
  // ----------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------
  // CREATE WATCH PARTY
  // ----------------------------
  const handleCreateParty = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await createWatchParty({ videoId });
      if (response.success) {
        navigate(`/watchparty/${response.roomCode}`);
      }
    } catch (error) {
      console.error("Error creating watch party:", error);
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };

  // ----------------------------
  // JOIN PARTY
  // ----------------------------
  const handleJoinParty = () => {
    setShowDropdown(false);
    setShowJoinModal(true);
  };

  const handleJoinViaCode = async () => {
    if (!roomCode.trim()) return;
    setLoading(true);
    try {
      const response = await joinWatchParty({ roomCode: roomCode.trim() });
      if (response.success) {
        navigate(`/watchparty/${roomCode.trim()}`);
      }
    } catch (error) {
      console.error("Error joining watch party:", error);
    } finally {
      setLoading(false);
      setShowJoinModal(false);
      setRoomCode("");
    }
  };

  if (!user) return null;

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <>
      <div className="relative select-none" ref={dropdownRef}>
        {/* MAIN BUTTON */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="
            px-4 py-2.5 rounded-full text-sm font-medium
            flex items-center gap-2
            bg-white/10 backdrop-blur-lg border border-white/20
            text-blue-300 hover:text-white hover:bg-white/15
            shadow-lg transition-all duration-200
          "
        >
          <FiUsers size={16} className="text-blue-400" />
          <span>Watch Party</span>
        </button>

        {/* DROPDOWN */}
        {showDropdown && (
          <div
            className="
              absolute top-full right-0 mt-3 w-52 z-50
              bg-[#111118]/90 backdrop-blur-xl
              border border-white/10 rounded-xl shadow-2xl 
              animate-fadeIn
            "
          >
            <button
              onClick={handleCreateParty}
              disabled={loading}
              className="
                w-full px-4 py-3 flex items-center gap-2 text-sm
                text-gray-200 hover:bg-white/10 transition rounded-t-xl
                disabled:opacity-50
              "
            >
              <FiPlusCircle size={16} className="text-blue-400" />
              {loading ? "Creating..." : "Create Watch Party"}
            </button>

            <button
              onClick={handleJoinParty}
              className="
                w-full px-4 py-3 flex items-center gap-2 text-sm
                text-gray-200 hover:bg-white/10 transition rounded-b-xl
              "
            >
              <FiLogIn size={16} className="text-green-400" />
              Join Watch Party
            </button>
          </div>
        )}
      </div>

      {/* JOIN MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#0f0f16]/90 border border-white/10 backdrop-blur-xl
                       p-6 rounded-2xl w-full max-w-md shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Join Watch Party</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg 
                bg-white/10 border border-white/20 
                text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                backdrop-blur-md
              "
            />

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowJoinModal(false)}
                className="
                  flex-1 py-2 text-gray-300 hover:text-white transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleJoinViaCode}
                disabled={loading || !roomCode.trim()}
                className="
                  flex-1 py-2 rounded-lg 
                  bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-500 hover:to-blue-400
                  text-white font-semibold
                  disabled:opacity-50
                  transition
                "
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>
    </>
  );
}
