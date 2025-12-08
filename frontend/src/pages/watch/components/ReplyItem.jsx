import { format } from "date-fns";
import { useState } from "react";
import CommentAvatar from "./Common/CommentAvatar";

export default function ReplyItem({ reply, onReply, isReplyFormVisible, setReplyFormVisibility, user }) {
  return (
    <div className="flex gap-3">
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
        <div className="flex items-center gap-4 mt-1">
          {user && (
            <button
              onClick={() => setReplyFormVisibility(prev => ({ ...prev, [reply._id]: !prev[reply._id] }))}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Reply
            </button>
          )}
        </div>
        {isReplyFormVisible && (
          <ReplyForm
            replyId={reply._id}
            onReply={onReply}
            setReplyFormVisibility={setReplyFormVisibility}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

function ReplyForm({ replyId, onReply, setReplyFormVisibility, user }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    await onReply(replyId, text);
    setText("");
    setReplyFormVisibility(prev => ({ ...prev, [replyId]: false }));
    setLoading(false);
  }

  return (
    <div className="mt-2 ml-10">
      <div className="flex gap-2">
        <CommentAvatar user={user} size="w-6 h-6" />
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent border-b border-white/20 text-white text-sm placeholder-gray-500 focus:border-blue-400 focus:outline-none resize-none min-h-[30px] py-1"
            placeholder="Reply..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setReplyFormVisibility(prev => ({ ...prev, [replyId]: false }))}
              className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!text.trim() || loading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-medium rounded-full transition-colors"
            >
              {loading ? "..." : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
