import { useState } from "react";
import { createComment } from "../../../api/commentApi";
import CommentItem from "./CommentItem";
import CommentAvatar from "./Common/CommentAvatar";
import LoadingSpinner from "./Common/LoadingSpinner";

export default function CommentsSection({
  videoId,
  comments,
  setComments,
  replies,
  showReplies,
  replyFormVisibility,
  setReplyFormVisibility,
  onReply,
  onToggleReplies,
  user,
}) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmitComment() {
    if (!commentText.trim() || loading) return;

    setLoading(true);
    try {
      const res = await createComment(videoId, commentText);
      setComments(prev => [res.data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      console.error("COMMENT POST ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      p-6 rounded-2xl bg-[#0f0f15]/80 
      backdrop-blur-xl border border-white/10 
      shadow-[0_0_40px_rgba(0,0,0,0.4)]
      transition-all
    ">
      
      {/* HEADER */}
      <h2 className="text-xl font-semibold text-white tracking-tight mb-6">
        {comments.length} Comments
      </h2>

      {/* COMMENT INPUT */}
      {user ? (
        <div className="mb-10">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <CommentAvatar user={user} size="w-10 h-10" />

            {/* Input Box */}
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                className="
                  w-full bg-white/5 text-white placeholder-gray-400 
                  border border-white/10 rounded-xl px-4 py-3
                  focus:border-blue-500 focus:outline-none 
                  transition-all duration-200 resize-none min-h-[60px]
                  shadow-inner
                "
              />

              {/* ACTION BUTTONS */}
              <div className="flex justify-end mt-3 gap-3">
                <button
                  onClick={() => setCommentText("")}
                  className="
                    px-4 py-1.5 text-sm text-gray-400 hover:text-white 
                    rounded-full transition-colors hover:bg-white/5
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || loading}
                  className="
                    px-5 py-1.5 text-sm font-medium rounded-full 
                    bg-gradient-to-br from-blue-600 to-blue-700 
                    text-white shadow-[0_0_15px_rgba(30,80,255,0.4)]
                    hover:from-blue-500 hover:to-blue-600 
                    disabled:opacity-40 disabled:cursor-not-allowed
                    flex items-center gap-2 transition-all
                  "
                >
                  {loading && <LoadingSpinner size="sm" />}
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center pb-6 border-b border-white/10 mb-8">
          Sign in to add a comment.
        </p>
      )}

      {/* COMMENT LIST */}
      <div className="space-y-10">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            replies={replies[comment._id] || []}
            showReplies={showReplies[comment._id]}
            isReplyFormVisible={replyFormVisibility[comment._id]}
            replyFormVisibility={replyFormVisibility}
            setReplyFormVisibility={setReplyFormVisibility}
            onToggleReplies={onToggleReplies}
            onReply={onReply}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
