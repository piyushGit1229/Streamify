import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for navigation
import { format } from "date-fns"; // For better date formatting
import { getHomeFeed } from "../../api/feedApi";
import { getVideo } from "../../api/videoApi";
import { likeVideo, dislikeVideo } from "../../api/interactionApi";
import { subscribe, unsubscribe, channelPage } from "../../api/subscriptionApi";

import CustomVideoPlayer from "../../components/video/CustomVideoPlayer";
import { FastAverageColor } from 'fast-average-color';
import AddToPlaylist from "../../components/common/AddToPlaylist";
import CutCreator from "../../components/cuts/CutCreator";
import RelatedCard from "../../components/video/RelatedCard";
import { FiThumbsUp, FiThumbsDown, FiShare2, FiBookmark, FiPlus } from "react-icons/fi";




import {
  getComments,
  createComment,
  replyComment,
  getReplies,
  // Assuming API for like/dislike comment exists
} from "../../api/commentApi";
import { useAuthStore } from "../../store/authStore";
import WatchPartyButton from "../../components/watchParty/WatchPartyButton";
// ============================================
// UI COMPONENTS - Placeholders/Enhanced
// ============================================

// A simple Loading Spinner for buttons
const LoadingSpinner = ({ size = "md" }) => (
  <svg
    className={`animate-spin text-white ${
      size === "sm" ? "w-4 h-4" : "w-5 h-5"
    }`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// A simple Skeleton Loader for the initial state
const Skeleton = ({ variant }) => {
  if (variant === "video")
    return (
      <div className="w-full aspect-video bg-[#181824] rounded-2xl animate-pulse"></div>
    );
  if (variant === "card")
    return (
      <div className="flex gap-2">
        <div className="w-[160px] h-[90px] bg-[#181824] rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-[#181824] rounded w-full"></div>
          <div className="h-3 bg-[#181824] rounded w-3/4"></div>
          <div className="h-3 bg-[#181824] rounded w-1/2"></div>
        </div>
      </div>
    );
  if (variant === "comment")
    return (
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#181824] flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#181824] rounded w-24"></div>
          <div className="h-4 bg-[#181824] rounded w-full"></div>
          <div className="h-4 bg-[#181824] rounded w-5/6"></div>
        </div>
      </div>
    );
  return null;
};









// ============================================
// MAIN WATCH PAGE COMPONENT
// ============================================

export default function WatchPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [dominantColor, setDominantColor] = useState('#0a0a0f');


  

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyFormVisibility, setReplyFormVisibility] = useState({}); // To manage reply form for each comment





  // --------------------------------------------
  // Fetch video + channel + comments + related
  // --------------------------------------------
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getVideo(id);
        setVideo(res.data.video);

        const channelRes = await channelPage(res.data.video.owner._id);
        setChannel(channelRes.data);

        // Fetch comments
        const commentsRes = await getComments(id);
        setComments(commentsRes.data.comments);

        const feedRes = await getHomeFeed();

console.log("FEED RESPONSE:", feedRes.data);

let allVideos = [];

// Merge all available arrays safely
const sub = Array.isArray(feedRes.data?.fromsubsrciption)
  ? feedRes.data.fromsubsrciption
  : [];

const trending = Array.isArray(feedRes.data?.trending)
  ? feedRes.data.trending
  : [];

const recommended = Array.isArray(feedRes.data?.recommended)
  ? feedRes.data.recommended
  : [];

// Combine + remove duplicates
allVideos = [...sub, ...trending, ...recommended];

// Remove current video
const filtered = allVideos.filter((v) => v._id !== id);

// Save to UI
setRelatedVideos(filtered);


         
      } catch (error) {
        console.error("WATCH ERROR:", error);
        // Add a toast/notification here for user
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // --------------------------------------------
  // Extract dominant color from thumbnail
  // --------------------------------------------
  useEffect(() => {
    if (video?.thumbnailUrl) {
      const fac = new FastAverageColor();
      fac.getColorAsync(video.thumbnailUrl)
        .then(color => {
          setDominantColor(color.hex);
        })
        .catch(err => {
          console.error('Error extracting color:', err);
        });
    }
  }, [video]);



  if (loading)
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="w-full flex justify-center">
        <div className="max-w-[1600px] w-full px-6 py-6 flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <Skeleton variant="video" />
            <div className="h-8 w-full bg-[#181824] rounded-lg animate-pulse"></div>
            <div className="h-10 w-full bg-[#181824] rounded-full animate-pulse"></div>
            <div className="bg-[#111118] rounded-2xl p-6 border border-white/5 space-y-6">
              <div className="h-8 w-48 bg-[#181824] rounded mb-6 animate-pulse"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="comment" />
              ))}
            </div>
          </div>
          <div className="w-[360px] shrink-0">
            <div className="bg-[#111118] rounded-2xl p-4 border border-white/5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!video) return <div className="text-white p-8">Video not found.</div>;



  

  // ============================================
  // LIKE / DISLIKE HANDLERS
  // ============================================
  const handleLike = async () => {
    try {
      const res = await likeVideo(video._id);
      setVideo((prev) => ({
        ...prev,
        likesCount: res.data.likesCount,
        dislikesCount: res.data.dislikesCount,
        isLiked: res.data.isLiked,
        isDisliked: res.data.isDisliked,
      }));
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await dislikeVideo(video._id);
      setVideo((prev) => ({
        ...prev,
        likesCount: res.data.likesCount,
        dislikesCount: res.data.dislikesCount,
        isLiked: res.data.isLiked,
        isDisliked: res.data.isDisliked,
      }));
    } catch (err) {
      console.error("DISLIKE ERROR:", err);
    }
  };

  // ============================================
  // SUBSCRIBE / UNSUBSCRIBE HANDLERS
  // ============================================
  const updateSubscription = (data) => {
    setChannel((prev) => ({
      ...prev,
      channel: {
        ...prev.channel,
        subscribersCount: data.subscriberCount,
      },
      isSubscribed: data.isSubscribed,
    }));
    setVideo((prev) => ({
      ...prev,
      isSubscribed: data.isSubscribed,
    }));
  };

  const handleSubscribe = async () => {
    if (subscribeLoading || !user) return;
    setSubscribeLoading(true);
    try {
      const res = await subscribe(video.owner._id);
      updateSubscription(res.data);
    } catch (err) {
      console.error("SUBSCRIBE ERROR:", err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (subscribeLoading || !user) return;
    setSubscribeLoading(true);
    try {
      const res = await unsubscribe(video.owner._id);
      updateSubscription(res.data);
    } catch (err) {
      console.error("UNSUBSCRIBE ERROR:", err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  // ============================================
  // COMMENT HANDLERS
  // ============================================
  const handleAddComment = async () => {
  if (!newComment.trim() || commentLoading) return;

  setCommentLoading(true);

  try {
    // API call → backend returns POPULATED comment
    const res = await createComment(id, newComment);

    const newCommentObj = res.data.comment;

    // Add this new populated comment to UI instantly
    setComments((prev) => [newCommentObj, ...prev]);

    setNewComment("");
  } catch (err) {
    console.error("COMMENT ERROR:", err);
  } finally {
    setCommentLoading(false);
  }
};


  const handleReply = async (commentId, replyText) => {
    try {
      const res = await replyComment(commentId, id, replyText);
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), res.data.reply],
      }));
      // Update the main comment's repliesCount locally for immediate feedback
      setComments((prevComments) =>
        prevComments.map((c) =>
          c._id === commentId ? { ...c, repliesCount: c.repliesCount + 1 } : c
        )
      );
      // Add toast: "Reply posted!"
    } catch (err) {
      console.error("REPLY ERROR:", err);
      // Add toast: "Failed to post reply."
    }
  };

  const toggleReplies = async (commentId) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
    } else {
      try {
        // Only fetch if replies haven't been fetched yet
        if (!replies[commentId] || replies[commentId].length === 0) {
          const res = await getReplies(commentId);
          setReplies((prev) => ({ ...prev, [commentId]: res.data.replies }));
        }
        setShowReplies((prev) => ({ ...prev, [commentId]: true }));
      } catch (err) {
        console.error("REPLIES ERROR:", err);
      }
    }
  };



  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="w-full flex justify-center">
        <div className="max-w-[1600px] w-full px-6 py-6 flex gap-6">
          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* VIDEO PLAYER CARD */}
            <div className="rounded-2xl overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
              <CustomVideoPlayer
                src={`/api/stream/${video._id}`}
                poster={video.thumbnailUrl}
              />
            </div>

            {/* TITLE & METADATA */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold leading-snug tracking-tight text-white">
                {video.title}
              </h1>

              {/* STATS + ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-t border-white/10">
                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <Link
                    to={`/channel/${video.owner._id}`}
                    className="font-semibold text-white hover:text-blue-400 transition"
                  >
                    {video.owner.name}
                  </Link>
                  <span className="text-gray-600">•</span>
                  <span>{video.views?.toLocaleString() || 0} views</span>
                  <span className="text-gray-600">•</span>
                  <span>{format(new Date(video.createdAt), "MMM dd, yyyy")}</span>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2">
                  {/* LIKE/DISLIKE CONTAINER */}
                  <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-lg overflow-hidden">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                                  ${
                                                    video.isLiked
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
                      onClick={handleDislike}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                                  ${
                                                    video.isDisliked
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
              </div>
            </div>

            {/* CHANNEL + DESCRIPTION CARD */}
            <div className="bg-[#101018]/95 border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Link to={`/channel/${video.owner._id}`} className="flex items-center gap-4 group">
                  <img
                    src={
                      video.owner.avatar || "https://i.pravatar.cc/50"
                    }
                    className="w-14 h-14 rounded-full border border-white/20 object-cover transition-transform duration-300 group-hover:scale-105"
                    alt="Channel Avatar"
                  />
                  <div>
                    <h3 className="font-bold text-xl group-hover:text-blue-400 transition-colors">
                      {video.owner.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {channel?.channel?.subscribersCount?.toLocaleString() || 0} subscribers
                    </p>
                  </div>
                </Link>

                {/* SUBSCRIBE BUTTON */}
                {user && video.owner && user._id !== video.owner._id && (
                  channel?.isSubscribed ? (
                    <button
                      onClick={handleUnsubscribe}
                      disabled={subscribeLoading}
                      className="px-6 py-2 rounded-full text-sm font-semibold
                                             bg-gray-700/50 text-white border border-white/20
                                             hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      {subscribeLoading ? <LoadingSpinner size="sm" /> : "Subscribed"}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribeLoading}
                      className="px-6 py-2 rounded-full text-sm font-bold
                                             bg-red-600 hover:bg-red-700
                                             text-white shadow-red-500/30 shadow-lg disabled:opacity-50 transition-transform duration-300 hover:scale-105"
                    >
                      {subscribeLoading ? <LoadingSpinner size="sm" /> : "SUBSCRIBE"}
                    </button>
                  )
                )}
              </div>

              {/* DESCRIPTION - Toggle Read More functionality needed for long descriptions */}
              {video.description && (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-[15px]">
                  {video.description}
                  {/* Read More/Less toggle logic would be implemented here */}
                </p>
              )}
            </div>


            <div className="mt-8">
  <CutCreator />
</div>


            {/* COMMENTS SECTION */}
            <div className="bg-[#101018]/95 rounded-2xl p-6 border border-white/5 shadow-lg">
              <h2 className="text-xl font-bold mb-6">
                {comments.length} Comments
              </h2>

              {/* ADD COMMENT */}
              {user ? (
                <div className="flex gap-4 mb-8">
                  <img
                    src={user.avatar || "https://i.pravatar.cc/50"}
                    className="w-10 h-10 rounded-full border border-white/20 flex-shrink-0 object-cover"
                    alt="User Avatar"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent border-b border-white/20 focus:border-blue-500 outline-none resize-none text-white placeholder-gray-500 p-2 transition-colors"
                      rows={newComment.trim() ? "3" : "1"}
                      onFocus={(e) => {
                          if (e.target.rows === 1) e.target.rows = 3;
                      }}
                    />
                    <div
                      className={`flex justify-end gap-3 mt-3 transition-all duration-300 ${
                        newComment.trim() ? "max-h-12 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      <button
                        onClick={() => setNewComment("")}
                        className="px-4 py-1 text-sm text-gray-400 hover:text-white transition-colors rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || commentLoading}
                        className="px-6 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2 shadow-md"
                      >
                        {commentLoading && <LoadingSpinner size="sm" />}
                        {commentLoading ? "Posting..." : "Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center border-b border-white/10 pb-6 mb-8">
                    Sign in to add a comment.
                </p>
              )}

              {/* COMMENTS LIST */}
              <div className="space-y-8">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    replies={replies[comment._id] || []}
                    showReplies={showReplies[comment._id]}
                    onToggleReplies={toggleReplies}
                    onReply={handleReply}
                    user={user}
                    isReplyFormVisible={replyFormVisibility[comment._id]}
                    setReplyFormVisibility={setReplyFormVisibility}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - Related Videos */}
          <div className="w-[360px] shrink-0">
          <div className="bg-[#101018] p-4 rounded-2xl border border-white/10 sticky top-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">
              More Videos
            </h3>

            <div className="space-y-4">
              {relatedVideos.length > 0 ? (
                relatedVideos.map((v) => (
                  <RelatedCard key={v._id} video={v} />
                ))
              ) : (
                <div className="text-gray-500 text-sm">No more videos found.</div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMMENT ITEM COMPONENT (Refined)
// ============================================
function CommentItem({
  comment,
  replies,
  showReplies,
  onToggleReplies,
  onReply,
  user,
  isReplyFormVisible,
  setReplyFormVisibility,
}) {
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || replyLoading) return;
    setReplyLoading(true);
    await onReply(comment._id, replyText);
    setReplyText("");
    setReplyFormVisibility((prev) => ({ ...prev, [comment._id]: false }));
    setReplyLoading(false);
  };

  const toggleReplyForm = () => {
    setReplyFormVisibility((prev) => ({
      ...prev,
      [comment._id]: !prev[comment._id],
    }));
    if (replyText.trim()) setReplyText(""); // Clear text if hiding
  };

  const CommentAvatar = ({ user, size = "w-10 h-10" }) => (
    <img
      src={user?.avatar || "https://i.pravatar.cc/50"}
      className={`${size} rounded-full border border-white/15 object-cover flex-shrink-0`}
      alt={`${user?.name || "Anonymous"}'s Avatar`}
    />
  );

  return (
    <div className="flex gap-4">
      <CommentAvatar user={comment.userId} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white">
            {comment.userId?.name || "Anonymous"}
            {comment.userId?._id === comment.videoOwnerId && (
              <span className="ml-2 text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full font-bold">
                CREATOR
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(comment.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
        <p className="text-gray-200 mb-2 text-[15px] leading-relaxed">
          {comment.content}
        </p>

        {/* COMMENT ACTIONS */}
        <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
          {/* Like/Dislike (Placeholder for API call) */}
          <div className="flex items-center gap-2">
            <button className="hover:text-blue-400 transition">👍</button>
            <span className="text-xs text-gray-500">0</span>
            <button className="hover:text-red-400 transition">👎</button>
          </div>
          
          {user && (
            <button
              onClick={toggleReplyForm}
              className="text-gray-400 hover:text-white transition-colors text-sm font-semibold"
            >
              Reply
            </button>
          )}

          {comment.repliesCount > 0 && (
            <button
              onClick={() => onToggleReplies(comment._id)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
            >
              <span className="text-base">{showReplies ? "▲" : "▼"}</span>
              {showReplies ? "Hide" : "View"}{" "}
              <span className="text-gray-400">{comment.repliesCount}</span> replies
            </button>
          )}
        </div>

        {/* REPLY FORM */}
        {isReplyFormVisible && user && (
          <div className="mt-4 flex gap-3 p-3 bg-[#181824] rounded-xl border border-white/10">
            <CommentAvatar user={user} size="w-8 h-8" />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${comment.userId?.name || "Commenter"}...`}
                className="w-full bg-transparent border-b border-white/15 focus:border-blue-500 outline-none resize-none text-white placeholder-gray-500 text-sm pb-1"
                rows={replyText.trim() ? "2" : "1"}
                onFocus={(e) => {
                    if (e.target.rows === 1) e.target.rows = 2;
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={toggleReplyForm}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || replyLoading}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-full flex items-center gap-2"
                >
                  {replyLoading && <LoadingSpinner size="sm" />}
                  {replyLoading ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPLIES LIST */}
        {showReplies && replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l border-white/10">
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                <CommentAvatar user={reply.userId} size="w-7 h-7" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">
                      {reply.userId?.name || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {format(new Date(reply.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {reply.content}
                  </p>
                  {/* Reply actions (like/dislike) omitted for brevity */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}