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
        const res = await axiosInstance.get(
          `/subscriptions/channel/${channelId}`
        );
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
    <div className="min-h-screen bg-black text-white pb-20">

      {/* 🔵 CHANNEL BANNER */}
      <div className="w-full h-52 md:h-64 bg-[#121212] rounded-b-3xl overflow-hidden shadow-xl">
        {channel.channelBanner ? (
          <img
            src={channel.channelBanner}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Banner Available
          </div>
        )}
      </div>

      {/* 🔵 CHANNEL HEADER SECTION */}
      <div className="p-6 flex flex-col md:flex-row md:items-center gap-8">
        
        {/* Avatar */}
        <img
          src={channel.avatar || "https://via.placeholder.com/120"}
          className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-2xl"
        />

        {/* Channel Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{channel.name}</h1>
          <p className="text-gray-400 text-sm">{channel.email}</p>

          <p className="text-gray-500 mt-2 text-sm">
            {stats.subscribersCount.toLocaleString()} subscribers •{" "}
            {stats.totalVideos} videos
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 
          ${
            channel.isSubscribed
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
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

      {/* 🔵 CHANNEL STATS BAR */}
      <div className="px-6 py-4 bg-[#0d0d0d] border-t border-b border-white/10 flex flex-wrap gap-10 text-gray-300 text-sm">
        
        <div className="flex items-center gap-2">
          <FiCalendar size={18} />  
          <span>Joined: {new Date(channel.createdAt).toDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiEye size={18} />
          <span>Total Views: {stats.totalViews}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiVideo size={18} />
          <span>Total Videos: {stats.totalVideos}</span>
        </div>
      </div>

      {/* 🔵 VIDEOS GRID */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Videos</h2>

        {videos.length === 0 ? (
          <p className="text-gray-500">This channel has no videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <Link
                to={`/watch/${v._id}`}
                key={v._id}
                className="bg-[#111] rounded-xl border border-white/10 overflow-hidden 
                           hover:bg-[#1a1a1a] transition shadow-lg group"
              >
                {/* Thumbnail */}
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={v.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Video Info */}
                <div className="p-3">
                  <h3 className="font-semibold group-hover:text-blue-400 transition line-clamp-2">
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {v.views} views
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
