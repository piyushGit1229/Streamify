import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";

export default function RelatedCard({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="block p-2 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-white/5"
    >
      {/* GLASS PANEL */}
      <div
        className="
          flex items-start gap-3 w-full rounded-xl
          bg-white/5
          backdrop-blur-sm
          border border-white/10
          shadow-lg
          transition-all duration-300
          hover:bg-white/10
          hover:backdrop-blur-md
          hover:border-white/20
          hover:shadow-xl
          p-3
        "
      >
        {/* Thumbnail */}
        <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/50">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          {/* Duration Tag */}
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Right Text Container */}
        <div className="flex flex-col justify-start flex-1 min-w-0 py-1">
          {/* Title — prevents overflow with line-clamp */}
          <h3
            className="text-sm font-semibold leading-snug text-white
                       line-clamp-2 overflow-hidden mb-1"
            title={video.title} // Tooltip for full title on hover
          >
            {video.title}
          </h3>

          {/* Channel name */}
          <p className="text-xs text-gray-400 truncate mb-0.5">
            {video.owner?.name || "Unknown"}
          </p>

          {/* Views + Time */}
          <p className="text-xs text-gray-500 truncate">
            {video.views?.toLocaleString() || 0} views • {video.uploadedAgo || "Just now"}
          </p>
        </div>

        {/* 3-dot menu */}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-white/10">
          <HiDotsVertical size={16} />
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
