import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";

export default function RelatedCard({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="flex items-start gap-3 p-2 rounded-xl cursor-pointer group transition"
    >
      {/* GLASS PANEL */}
      <div
        className="
          flex items-start gap-3 w-full rounded-xl
          bg-black/20
          backdrop-blur-xl
          border border-white/10
          shadow-[0_8px_24px_rgba(0,0,0,0.6)]
          transition-all duration-300
          hover:bg-black/30
          hover:backdrop-blur-2xl
          hover:border-white/20
          hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)]
        "
      >
      {/* Thumbnail */}
      <div className="relative w-40 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-black">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition group-hover:brightness-90"
        />

        {/* Duration Tag */}
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] px-1.5 py-[1px] rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Right Text Container */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        
        {/* 🔥 Title — prevents overflow ALWAYS */}
        <h3
          className="text-[13px] font-semibold leading-tight text-white 
                     line-clamp-2 overflow-hidden"
        >
          {video.title}
        </h3>

        {/* Channel name */}
        <p className="text-xs text-gray-400 mt-1 truncate">
          {video.owner?.name || "Unknown"}
        </p>

        {/* Views + Time */}
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {video.views || 0} views • {video.uploadedAgo || "Just now"}
        </p>
      </div>

      {/* 3-dot menu */}
      <button className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-200">
        <HiDotsVertical size={18} />
      </button>
      </div>
    </Link>
  );
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
