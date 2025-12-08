import { useState } from "react";
import { getReplies, replyComment } from "../../../api/commentApi";

export function useComments(videoId) {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyFormVisibility, setReplyFormVisibility] = useState({});

  async function handleReply(commentId, text) {
    const res = await replyComment(commentId, videoId, text);

    setReplies(prev => ({
      ...prev,
      [commentId]: [...(prev[commentId] || []), res.data.reply]
    }));

    setComments(prev =>
      prev.map(c =>
        c._id === commentId
          ? { ...c, repliesCount: c.repliesCount + 1 }
          : c
      )
    );
  }

  async function toggleReplies(commentId) {
    const isOpen = showReplies[commentId];

    if (isOpen) {
      setShowReplies(prev => ({ ...prev, [commentId]: false }));
      return;
    }

    if (!replies[commentId]) {
      const res = await getReplies(commentId);
      setReplies(prev => ({ ...prev, [commentId]: res.data.replies }));
    }

    setShowReplies(prev => ({ ...prev, [commentId]: true }));
  }

  return {
    comments,
    setComments,
    replies,
    showReplies,
    replyFormVisibility,
    setReplyFormVisibility,
    handleReply,
    toggleReplies
  };
}
