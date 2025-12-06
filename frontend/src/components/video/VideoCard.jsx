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
      {/* MAIN GLASS CONTAINER */}
      <div
        className="
          rounded-xl
          bg-white/[0.06]
          backdrop-blur-xl
          border border-white/10
          shadow-[0_8px_24px_rgba(0,0,0,0.45)]
          transition-all duration-300
          overflow-hidden

          group-hover:bg-white/[0.10]
          group-hover:border-white/20
          group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.65)]
        "
      >
        {/* THUMBNAIL */}
        <div
          className="
            relative 
            w-full 
            aspect-video 
            overflow-hidden
          "
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="
              w-full 
              h-full 
              object-cover
              transition-all 
              duration-500
              group-hover:scale-[1.06]
              group-hover:brightness-90
            "
          />

          {/* DURATION BADGE */}
          <span
            className="
              absolute 
              bottom-2 
              right-2 
              bg-black/75 
              backdrop-blur-md
              text-white 
              text-xs 
              px-2.5 
              py-1 
              rounded-md 
              font-semibold
              shadow-md
            "
          >
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* VIDEO INFO */}
        <div className="flex gap-3 mt-3 p-3 pb-4">

          {/* CHANNEL AVATAR */}
          <img
            src={
              video.owner?.avatar ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            className="
              w-10 h-10 
              rounded-full 
              object-cover
              border border-white/20
              shadow-sm
            "
          />

          {/* TEXT SECTION */}
          <div className="flex flex-col min-w-0">

            {/* TITLE */}
            <p
              className="
                text-[15px] 
                text-white 
                font-semibold 
                leading-tight 
                line-clamp-2
                transition-colors duration-300
                group-hover:text-blue-300
              "
            >
              {video.title}
            </p>

            {/* CHANNEL NAME */}
            <p className="text-sm text-gray-300 mt-1">
              {video.owner?.name}
            </p>

            {/* VIEWS + TIME */}
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
  const diff = (Date.now() - new Date(date)) / 1000;
  const days = diff / 86400;

  if (days < 1) return "Today";
  if (days < 7) return `${Math.floor(days)} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
