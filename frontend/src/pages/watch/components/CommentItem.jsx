import { useState } from "react";
import ReplyItem from "./ReplyItem";
import CommentAvatar from "./Common/CommentAvatar";
import LoadingSpinner from "./Common/LoadingSpinner";
import { format } from "date-fns";

export default function CommentItem({
  comment,
  replies,
  showReplies,
  isReplyFormVisible,
  onReply,
  onToggleReplies,
  setReplyFormVisibility,
  replyFormVisibility,
  user
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReply() {
    if (!text.trim()) return;

    setLoading(true);
    await onReply(comment._id, text);
    setText("");
    setReplyFormVisibility(prev => ({ ...prev, [comment._id]: false }));
    setLoading(false);
  }

  return (
    <div className="flex gap-4">
      
      {/* Avatar */}
      <CommentAvatar user={comment.userId} size="w-10 h-10" />

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* NAME + DATE */}
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white">{comment.userId?.name}</p>

          {comment.userId?._id === comment.videoOwnerId && (
            <span className="
              bg-blue-600/20 text-blue-400 
              text-[10px] px-2 py-0.5 rounded-full font-bold
            ">
              CREATOR
            </span>
          )}

          <span className="text-xs text-gray-500">
            {format(new Date(comment.createdAt), "MMM dd, yyyy")}
          </span>
        </div>

        {/* MESSAGE */}
        <p className="text-gray-300 leading-relaxed mt-1">
          {comment.content}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4 mt-2 text-sm font-medium">
          {user && (
            <button
              onClick={() =>
                setReplyFormVisibility(prev => ({
                  ...prev,
                  [comment._id]: !prev[comment._id]
                }))
              }
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Reply
            </button>
          )}

          {comment.repliesCount > 0 && (
            <button
              onClick={() => onToggleReplies(comment._id)}
              className="text-gray-400 hover:text-white transition"
            >
              {showReplies ? "Hide replies" : `View replies (${comment.repliesCount})`}
            </button>
          )}
        </div>

        {/* -----------------------------------------------------------
            REPLY INPUT BOX — Streamify Premium UI
        ----------------------------------------------------------- */}
        {isReplyFormVisible && user && (
          <div className="
            mt-4 ml-1 flex gap-3 
            bg-[#14141B]/80 
            border border-white/10 
            rounded-xl p-4 
            backdrop-blur-md
            shadow-[0_4px_12px_rgba(0,0,0,0.25)]
            transition-all
          ">
            
            {/* User Avatar */}
            <CommentAvatar user={user} size="w-8 h-8" />

            {/* Textarea + Buttons */}
            <div className="flex-1">
              <textarea
                className="
                  w-full bg-transparent text-white 
                  border-b border-white/10 
                  focus:border-blue-500/60 
                  outline-none text-sm pb-2
                  placeholder-gray-500
                  transition
                "
                placeholder={`Reply to ${comment.userId?.name}…`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={1}
              />

              <div className="flex justify-end mt-3 gap-3">
                <button
                  onClick={() =>
                    setReplyFormVisibility(prev => ({ ...prev, [comment._id]: false }))
                  }
                  className="
                    text-xs px-3 py-1 
                    text-gray-400 hover:text-white 
                    hover:bg-white/5 rounded-full transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={submitReply}
                  disabled={!text.trim() || loading}
                  className="
                    text-xs px-4 py-1 rounded-full 
                    bg-blue-600 hover:bg-blue-700 
                    text-white flex items-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-[0_0_12px_rgba(30,80,255,0.35)]
                    transition
                  "
                >
                  {loading && <LoadingSpinner size="sm" />}
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------
            REPLIES LIST
        ----------------------------------------------------------- */}
        {showReplies && replies.length > 0 && (
          <div className="mt-4 pl-6 border-l border-white/10 space-y-4">
            {replies.map((reply) => (
              <ReplyItem
                key={reply._id}
                reply={reply}
                isReplyFormVisible={replyFormVisibility[reply._id]}
                setReplyFormVisibility={setReplyFormVisibility}
                onReply={onReply}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
