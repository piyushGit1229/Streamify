import { FiThumbsUp, FiThumbsDown, FiShare2 } from "react-icons/fi";
import AddToPlaylist from "../../../components/common/AddToPlaylist";
import WatchPartyButton from "../../../components/watchParty/WatchPartyButton";

const VideoActions = ({ video, user, onLike, onDislike }) => {
  return (
    <div className="flex items-center gap-2">
      {/* LIKE/DISLIKE CONTAINER */}
      <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-lg overflow-hidden">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                  ${video.isLiked
                                    ? "text-blue-400 hover:bg-blue-500/10"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }`}
        >
          <FiThumbsUp
            size={18}
            className={`transition-all duration-200 ${
              video.isLiked ? "fill-current text-blue-400" : "group-hover:scale-110"
            }`}
          />
          <span className="font-semibold">{video.likesCount?.toLocaleString() || 0}</span>
        </button>

        <div className="w-px h-5 bg-white/20"></div>

        <button
          onClick={onDislike}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                  ${video.isDisliked
                                    ? "text-red-400 hover:bg-red-500/10"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }`}
        >
          <FiThumbsDown
            size={18}
            className={`transition-all duration-200 ${
              video.isDisliked ? "fill-current text-red-400" : "group-hover:scale-110"
            }`}
          />
        </button>
      </div>

      {/* SHARE BUTTON */}
      <button
        onClick={() => navigator.share?.({ url: window.location.href, title: video.title })}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 shadow-lg backdrop-blur-sm bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
      >
        <FiShare2
          size={18}
          className="transition-all duration-200 group-hover:scale-110"
        />
        <span className="font-medium">Share</span>
      </button>

      {/* ADD TO PLAYLIST BUTTON */}
      {user && <AddToPlaylist videoId={video._id} />}

      {/* WATCH PARTY BUTTON */}
      {user && <WatchPartyButton videoId={video._id} />}
    </div>
  );
};

export default VideoActions;
