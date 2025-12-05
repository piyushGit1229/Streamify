import { useEffect, useState } from "react";
import { getHomeFeed } from "../api/feedApi";
import Skeleton from "../components/common/Skeleton";
import { Link } from "react-router-dom";

export default function TrendingPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mouse tracking for parallax effect
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
    getHomeFeed()
      .then((res) => {
        const { trending } = res.data;
        setVideos(trending || []);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0f0f12] text-white p-8 overflow-hidden">

        {/* BACKGROUND GLOW EFFECT — SAME AS UPLOAD PAGE */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-[450px] h-[450px] bg-[#2563eb]/25 blur-3xl rounded-full animate-pulse"
            style={{
              top: "20%",
              left: "10%",
              transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)`
            }}
          />

          <div
            className="absolute w-[350px] h-[350px] bg-[#3b82f6]/20 blur-3xl rounded-full animate-pulse"
            style={{
              bottom: "15%",
              right: "15%",
              transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`
            }}
          />
        </div>

        {/* Loading Skeleton */}
        <Skeleton variant="text" className="h-12 w-64 mb-6" />
        <Skeleton variant="text" className="h-6 w-96 mb-12" />
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="relative min-h-screen bg-[#0f0f12] text-white flex items-center justify-center overflow-hidden">

        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-[400px] h-[400px] bg-[#2563eb]/20 blur-3xl rounded-full animate-pulse"
            style={{
              top: "22%",
              left: "12%",
              transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4}px)`
            }}
          />
          <div
            className="absolute w-[320px] h-[320px] bg-[#3b82f6]/20 blur-3xl rounded-full animate-pulse"
            style={{
              bottom: "12%",
              right: "18%",
              transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`
            }}
          />
        </div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl font-semibold">No trending videos yet</h2>
          <p className="text-gray-400 mt-2">Check back later</p>
        </div>
      </div>
    );
  }

  const featured = videos[0];

  return (
    <div className="relative min-h-screen bg-[#0f0f12] text-white p-10 overflow-hidden">

      {/* --- BLUE GLOW BACKGROUND (UPLOAD PAGE STYLE) --- */}
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

      {/* === CONTENT START === */}
      <div className="relative z-10">

        {/* HEADER */}
        <div className="mb-12">
          <span className="text-sm uppercase font-semibold bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
            Worldwide
          </span>

          <h1 className="text-5xl font-extrabold mt-4 tracking-tight">
            Trending Videos
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            The most popular videos gaining attention right now.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT LIST */}
          <div className="space-y-10">
            {videos.map((video, index) => (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                className="
                  flex items-center gap-6 group p-3 rounded-xl
                  hover:bg-white/5 transition
                  hover:backdrop-blur-xl
                  hover:shadow-[0_8px_40px_rgba(255,255,255,0.08)]
                  transform hover:-translate-y-1 hover:scale-[1.02]
                "
              >
                <div className="text-4xl font-bold text-gray-600 group-hover:text-blue-400 transition">
                  {index + 1}
                </div>

                <div className="
                    w-40 h-24 overflow-hidden rounded-lg 
                    transition transform group-hover:scale-110
                    group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]
                ">
                  <img
                    src={video.thumbnailUrl}
                    className="w-full h-full object-cover"
                    alt={video.title}
                  />
                </div>

                <div>
                  <h3 className="
                    text-xl font-semibold transition 
                    group-hover:text-white line-clamp-1
                  ">
                    {video.title}
                  </h3>

                  <p className="text-sm text-gray-400 line-clamp-1">
                    {video.owner?.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* FEATURED VIDEO */}
          <div
            className="
              relative rounded-3xl overflow-hidden 
              shadow-[0_15px_70px_rgba(0,0,0,0.7)] 
              border border-white/10
              transform transition 
              hover:scale-[1.03] hover:-translate-y-2
              hover:shadow-[0_25px_90px_rgba(0,0,0,0.9)]
              hover:rotate-[0.8deg]
            "
            style={{
              perspective: "1000px",
              transform: `rotateX(${mouse.y * 0.02}deg) rotateY(${mouse.x * 0.02}deg)`
            }}
          >
            <img
              src={featured.thumbnailUrl}
              className="
                w-full h-[600px] object-cover opacity-90 
                transition-transform duration-500
                hover:scale-110 hover:rotate-[1deg]
              "
              alt={featured.title}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20"></div>

            <div className="absolute bottom-10 left-10">
              <h2 className="text-4xl font-extrabold drop-shadow-2xl">
                #{1} — {featured.title}
              </h2>
              <p className="text-gray-300 mt-2 text-lg">
                {featured.owner?.name}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
