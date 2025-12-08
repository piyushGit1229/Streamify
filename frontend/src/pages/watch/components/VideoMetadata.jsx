import VideoActions from "./VideoActions";
import { format } from "date-fns";

export default function VideoMetadata({ video, user, onLike, onDislike }) {
  return (
    <div className="bg-[#111118] rounded-2xl p-6 border border-white/5">
      <h1 className="text-white text-2xl font-bold mb-2">{video.title}</h1>

      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm flex gap-2">
          <span>{video.views?.toLocaleString()} views</span>
          <span>•</span>
          <span>{format(new Date(video.createdAt), "MMM dd, yyyy")}</span>
        </div>

        <VideoActions
          video={video}
          user={user}
          onLike={onLike}
          onDislike={onDislike}
        />
      </div>
    </div>
  );
}
