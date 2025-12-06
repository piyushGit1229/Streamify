import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";
import {
  FiEye,
  FiVideo,
  FiCalendar,
  FiUserPlus,
  FiCheckCircle,
} from "react-icons/fi";

export default function ChannelPage() {
  const { channelId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await axiosInstance.get(`/subscriptions/channel/${channelId}`);
        setData(res.data);
      } catch (err) {
        console.error("CHANNEL ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, [channelId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading channel...
      </div>
    );

  if (!data)
    return <div className="min-h-screen p-10 text-white">Channel not found.</div>;

  const { channel, videos, stats } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">

      {/* 🌌 BANNER (GLASSY) */}
      <div className="relative w-full h-56 md:h-72 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-10" />

        {channel.channelBanner ? (
          <img
            src={channel.channelBanner}
            className="w-full h-full object-cover scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Banner Available
          </div>
        )}
      </div>

      {/* 🌟 CHANNEL MAIN HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 px-6 -mt-12 relative z-20">

        {/* Avatar with Glow */}
        <img
          src={channel.avatar || "https://via.placeholder.com/120"}
          className="
            w-32 h-32 rounded-full object-cover shadow-xl border-4 border-black/60
            ring-4 ring-white/10 backdrop-blur-xl
          "
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-wide">{channel.name}</h1>
          <p className="text-gray-400 text-sm">{channel.email}</p>

          <p className="text-gray-400 mt-2 text-sm">
            {stats.subscribersCount.toLocaleString()} subscribers •{" "}
            {stats.totalVideos} videos
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          className={`
            px-7 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 
            transition-all duration-200 shadow-xl backdrop-blur-xl
            ${
              channel.isSubscribed
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
            }
          `}
        >
          {channel.isSubscribed ? (
            <>
              <FiCheckCircle size={18} /> Subscribed
            </>
          ) : (
            <>
              <FiUserPlus size={18} /> Subscribe
            </>
          )}
        </button>
      </div>

      {/* 📊 STATS BAR (GLASSY STRIP) */}
      <div className="
        mt-8 mx-6 p-4 rounded-xl bg-white/5 backdrop-blur-xl 
        border border-white/10 flex flex-wrap gap-8 shadow-2xl
      ">
        <div className="flex items-center gap-2 text-gray-300">
          <FiCalendar size={18} />
          <span>Joined: {new Date(channel.createdAt).toDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FiEye size={18} />
          <span>{stats.totalViews} total views</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FiVideo size={18} />
          <span>{stats.totalVideos} videos</span>
        </div>
      </div>

      {/* 🎥 VIDEO GRID */}
      <div className="px-6 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Videos</h2>

        {videos.length === 0 ? (
          <p className="text-gray-500">This channel has no videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((v) => (
              <Link
                to={`/watch/${v._id}`}
                key={v._id}
                className="
                  group rounded-xl overflow-hidden
                  bg-white/5 border border-white/10
                  backdrop-blur-lg shadow-lg hover:shadow-2xl 
                  transition-all duration-300 hover:bg-white/10
                "
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 overflow-hidden rounded-t-xl">
                  <img
                    src={v.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <span className="
                    absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-md
                    bg-black/70 text-white shadow-lg
                  ">
                    {formatDuration(v.duration)}
                  </span>
                </div>

                {/* Text Content */}
                <div className="p-4">
                  <h3 className="
                    font-semibold text-[15px] mb-1 
                    line-clamp-2 group-hover:text-blue-400 transition
                  ">
                    {v.title}
                  </h3>

                  <p className="text-gray-400 text-xs">
                    {v.views} views • {v.uploadedAgo || "Recently"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
