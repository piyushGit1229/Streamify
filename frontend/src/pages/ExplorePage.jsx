import { useEffect, useState } from "react";
import { getExploreData } from "../api/exploreApi";
import { Link } from "react-router-dom";

/* ------------------ CATEGORY LIST ------------------ */
const categories = [
  { key: "trending", label: "🔥 Trending" },
  { key: "topMusic", label: "🎵 Music" },
  { key: "tech", label: "💻 Tech" },
  { key: "gaming", label: "🎮 Gaming" },
  { key: "education", label: "🎓 Education" },
  { key: "recent", label: "🆕 Recent Uploads" },
];

const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function ExplorePage() {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState("trending");
  const [loading, setLoading] = useState(true);

  // 🔵 BLUE GLOW PARALLAX EFFECT
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

  // Fetch Explore API
  useEffect(() => {
    getExploreData()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const videos = data[selected] || [];

  return (
    <div className="relative min-h-screen bg-[#0f0f12] text-white p-10 overflow-hidden">

      {/* ------------------ BLUE GLOW BG ------------------ */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] bg-[#2563eb]/25 blur-3xl rounded-full animate-pulse"
          style={{
            top: "18%",
            left: "10%",
            transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4}px)`
          }}
        />
        <div
          className="absolute w-[380px] h-[380px] bg-[#3b82f6]/25 blur-3xl rounded-full animate-pulse"
          style={{
            bottom: "10%",
            right: "18%",
            transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`
          }}
        />
      </div>

      {/* ------------------ PAGE CONTENT ------------------ */}
      <div className="relative z-10">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight">Explore</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Discover trending topics, creators, and the latest videos.
          </p>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex gap-3 overflow-x-auto border-b border-white/10 pb-4 sticky top-0 bg-[#0f0f12]/80 backdrop-blur-xl z-20 rounded-lg"
             style={{ scrollbarWidth: "none" }}>

          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${
                  selected === cat.key
                    ? "bg-white text-black shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-gray-400 mt-10 animate-pulse text-lg">
            Loading Explore...
          </div>
        )}

        {/* VIDEO GRID */}
        <div className="grid mt-10 gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <ExploreCard key={v._id} video={v} />
          ))}

          {!videos.length && !loading && (
            <p className="text-gray-500 col-span-full text-center text-lg">
              No videos found in this category.
            </p>
          )}
        </div>

        {/* POPULAR CHANNELS */}
        <PopularChannels channels={data.popularChannels || []} />
      </div>
    </div>
  );
}

/* ===========================
      VIDEO CARD COMPONENT
=========================== */
function ExploreCard({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="
        group rounded-xl overflow-hidden bg-[#111] border border-white/10 
        hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]
        hover:border-blue-500/30 transition-all duration-300 relative
      "
    >
      {/* THUMBNAIL */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        <span className="absolute bottom-1 right-1 bg-black/70 text-[10px] px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* TEXT CONTENT */}
      <div className="p-3">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition">
          {video.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{video.owner?.name}</p>
        <p className="text-xs text-gray-500">{video.views} views</p>
      </div>
    </Link>
  );
}

/* ===========================
      POPULAR CHANNELS
=========================== */
function PopularChannels({ channels }) {
  if (!channels.length) return null;

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold mb-6">🌟 Popular Channels</h2>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {channels.map((ch) => (
          <Link
            key={ch._id}
            to={`/channel/${ch._id}`}
            className="
              flex flex-col items-center bg-[#111] p-4 rounded-xl 
              border border-white/10 hover:bg-white/10 hover:scale-105 
              transition-all duration-300
            "
          >
            <img
              src={ch.avatar || "https://i.pravatar.cc/80"}
              className="w-16 h-16 rounded-full object-cover border border-white/20"
            />
            <p className="mt-3 font-semibold text-sm">{ch.name}</p>
            <span className="text-xs text-gray-400">
              {ch.subscribersCount || 0} subs
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
