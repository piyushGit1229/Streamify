import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../../api/playlistApi";
import { FiMoreHorizontal } from "react-icons/fi";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  // Glow Effect
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) =>
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    getPlaylist(id).then((res) => setPlaylist(res.data.playlist));
  }, [id]);

  if (!playlist)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center text-lg">
        Loading Playlist...
      </div>
    );

  const handleRemove = async (vid) => {
    await removeVideoFromPlaylist(id, vid);
    setPlaylist((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v._id !== vid),
    }));
  };

  const handleDeletePlaylist = async () => {
    await deletePlaylist(id);
    window.location.href = "/library/playlists";
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex gap-10 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <BackgroundGlow mouse={mouse} />

      {/* ========== LEFT FIXED PANEL (EXACT LIKE LIKED PAGE) ========== */}
      <div className="w-[380px] rounded-3xl p-6 bg-gradient-to-b from-[#1c2333] to-black border border-white/10 shadow-2xl sticky top-8 h-fit z-10">

        {/* Thumbnail */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
          <img
            src={
              playlist.thumbnail ||
              playlist.videos?.[0]?.thumbnailUrl ||
              "https://i.ytimg.com/img/no_thumbnail.jpg"
            }
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>

        <p className="text-gray-400 text-sm">Private • Playlist</p>
        <p className="text-gray-500 text-sm mt-1">
          {playlist.videos.length} videos • Updated today
        </p>

        {/* DELETE BUTTON ONLY (AS REQUESTED) */}
        <button
          onClick={handleDeletePlaylist}
          className="mt-6 px-6 py-3 rounded-full bg-red-600/80 text-white font-semibold hover:bg-red-700 transition shadow-lg hover:scale-105"
        >
          Delete Playlist
        </button>
      </div>

      {/* ========== RIGHT VIDEO LIST (SCROLLABLE) ========== */}
      <div className="flex-1 max-h-[calc(100vh-40px)] overflow-y-auto pr-4 relative z-10">

        <div className="space-y-6">
          {playlist.videos.map((video, index) => (
            <PlaylistVideoRow
              key={video._id}
              video={video}
              index={index + 1}
              onRemove={() => handleRemove(video._id)}
            />
          ))}
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
      GLOW BACKGROUND (EXACT COPY FROM LIKED PAGE)
-------------------------------------------------------- */
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

/* -------------------------------------------------------
      VIDEO ROW (IDENTICAL TO LIKED PAGE)
-------------------------------------------------------- */
function PlaylistVideoRow({ video, index, onRemove }) {
  return (
    <div
      className="flex gap-4 group hover:bg-white/5 p-3 rounded-xl transition relative"
    >
      {/* Index */}
      <div className="text-gray-500 w-6 text-right group-hover:text-white">
        {index}
      </div>

      {/* Thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        className="relative w-48 h-28 rounded-xl overflow-hidden"
      >
        <img
          src={video.thumbnailUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <span className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 text-xs rounded">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold group-hover:text-blue-400 transition line-clamp-1">
          {video.title}
        </h3>

        <p className="text-gray-400 text-sm">
          {video.owner?.name || "Unknown"}
        </p>

        <p className="text-gray-500 text-xs">{video.views} views</p>
      </div>

      <div className="flex-grow"></div>

      {/* REMOVE BUTTON */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:white-white-500 font-semibold"
      >
        Remove
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
