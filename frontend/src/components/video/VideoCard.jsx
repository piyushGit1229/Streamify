import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="
        group 
        block 
        cursor-pointer 
        w-full 
        transition-all 
        duration-300
        rounded-xl
        p-2
      "
    >
      {/* GLASS PANEL */}
      <div
        className="
          rounded-xl
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
        <div
          className="
            relative 
            w-full 
            aspect-video 
            rounded-xl 
            overflow-hidden 
            bg-[#0f0f0f] 
            transition-all 
            duration-200
            group-hover:shadow-md
          "
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="
              w-full 
              h-full 
              object-cover 
              rounded-xl
              transition-transform 
              duration-300 
              group-hover:scale-[1.04]
            "
          />

          <span
            className="
              absolute 
              bottom-2 
              right-2 
              bg-black/80 
              text-white 
              text-xs 
              px-2 
              py-1 
              rounded 
              font-medium
            "
          >
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Info */}
        <div className="flex gap-3 mt-3 p-2">
          <img
            src={
              video.owner?.avatar ||
              'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            }
            className="w-9 h-9 rounded-full object-cover"
          />

          <div className="flex flex-col min-w-0">
            <p className="text-[15px] text-white font-medium leading-tight line-clamp-2">
              {video.title}
            </p>

            <p className="text-sm text-gray-300 mt-1">{video.owner?.name}</p>

            <p className="text-sm text-gray-400">
              {video.views || 0} views • {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
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

function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000 / 60 / 60 / 24 / 7;
  return `${Math.floor(diff)} weeks ago`;
}
