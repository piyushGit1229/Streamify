import { Link } from "react-router-dom";

export default function VideoCardRow({ video }) {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="flex gap-4 w-full hover:bg-white/5 transition-all p-3 rounded-xl"
    >
      {/* Thumbnail */}
      <div className="w-80 h-44 bg-black rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side info */}
      <div className="flex flex-col justify-start">
        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-1">
          {video.title}
        </h2>

        {/* Channel + views */}
        <p className="text-gray-400 text-sm mb-4">
          {video.owner.name} • {video.views || 0} views • {video.timeAgo}
        </p>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 max-w-2xl">
          {video.description || "No description available."}
        </p>
      </div>
    </Link>
  );
}
