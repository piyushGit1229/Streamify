import { useEffect, useState } from "react";
import { getMyCuts, deleteCut } from "../../api/cutApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  FiDownload,
  FiMoreHorizontal,
  FiPlay,
  FiShuffle,
  FiTrash2
} from "react-icons/fi";

export default function MyCutsPage() {
  const [cuts, setCuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Glow effect mouse tracking
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    getMyCuts()
      .then((res) => setCuts(res.data.cuts || []))
      .catch((error) => {
        console.error("Failed to fetch cuts:", error);
        setCuts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlayCut = (cut) => {
    navigate(`/watch/${cut.video._id}?start=${cut.startSeconds}&end=${cut.endSeconds}`);
  };

  const handleDelete = async (cutId) => {
    try {
      await deleteCut(cutId);
      setCuts((prev) => prev.filter((c) => c._id !== cutId));
    } catch (error) {
      console.error("Failed to delete cut:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-lg">
        Loading My Cuts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 flex gap-10 relative overflow-hidden">

      {/* ========= GLOW BACKGROUND ========= */}
      <BackgroundGlow mouse={mouse} />

      {/* ========= LEFT FIXED PANEL ========= */}
      <div className="w-[380px] rounded-3xl p-6 bg-gradient-to-b from-[#1c2333] to-black border border-white/10 shadow-2xl sticky top-8 h-fit z-10">

        {/* Thumbnail Preview */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
          <img
            src={
              cuts[0]?.video?.thumbnailUrl ||
              "https://i.ytimg.com/img/no_thumbnail.jpg"
            }
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-3xl font-bold mb-2">My Cuts</h2>

        <p className="text-gray-400 capitalize text-sm">{user?.name}</p>
        <p className="text-gray-500 text-sm mt-1">
          {cuts.length} cuts • Updated today
        </p>

        {/* Icons */}
        <div className="flex items-center gap-4 mt-8">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FiDownload size={22} />
          </button>

          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FiMoreHorizontal size={22} />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-300 transition shadow-lg">
            <FiPlay size={20} /> Play All
          </button>

          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition shadow-lg">
            <FiShuffle size={20} /> Shuffle
          </button>
        </div>
      </div>

      {/* ========= RIGHT SCROLLABLE LIST ========= */}
      <div className="flex-1 max-h-[calc(100vh-40px)] overflow-y-auto pr-4 relative z-10">

        <div className="space-y-6">
          {cuts.map((cut, index) => (
            <CutRow key={cut._id} index={index + 1} cut={cut} onPlay={handlePlayCut} onDelete={handleDelete} />
          ))}
        </div>

        <div className="h-20"></div> {/* padding bottom */}
      </div>
    </div>
  );
}

/* -----------------------------------
      GLOW BACKGROUND COMPONENT
----------------------------------- */
function BackgroundGlow({ mouse }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full"
        style={{
          top: "12%",
          left: "8%",
          transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)`,
        }}
      />

      <div
        className="absolute w-[420px] h-[420px] bg-purple-600/25 blur-3xl rounded-full"
        style={{
          bottom: "8%",
          right: "10%",
          transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`,
        }}
      />
    </div>
  );
}

/* -----------------------------------
      CUT ROW COMPONENT
----------------------------------- */
function CutRow({ cut, index, onPlay, onDelete }) {
  return (
    <div className="flex gap-4 group hover:bg-white/5 p-3 rounded-xl transition">
      {/* index number */}
      <div className="text-gray-500 w-6 text-right group-hover:text-white">
        {index}
      </div>

      {/* thumbnail */}
      <div className="relative w-48 h-28 rounded-xl overflow-hidden cursor-pointer" onClick={() => onPlay(cut)}>
        <img
          src={cut.video?.thumbnailUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 text-xs rounded">
          {formatDuration(cut.endSeconds - cut.startSeconds)}
        </span>
      </div>

      {/* info */}
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold group-hover:text-blue-400 transition line-clamp-1">
          {cut.title || "Untitled Cut"}
        </h3>

        <p className="text-gray-400 text-sm">
          From: {cut.video?.title || "Unknown Video"}
        </p>

        <p className="text-gray-500 text-xs">
          {cut.video?.owner?.name || "Unknown"} • {cut.video?.views || 0} views
        </p>

        <p className="text-gray-500 text-xs">
          {formatDuration(cut.startSeconds)} → {formatDuration(cut.endSeconds)}
        </p>
      </div>

      <div className="flex-grow"></div>

      {/* menu */}
      <button
        onClick={() => onDelete(cut._id)}
        className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
      >
        <FiTrash2 size={22} />
      </button>
    </div>
  );
}

/* Utility */
function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
