import asyncHandler from "../utils/asyncHandler.js";
import {
  addComment,
  addReply,
  getVideoComments,
  getReplies,
  deleteComment,
} from "../services/comment.service.js";
import Comment from "../models/comment.model.js";

// CREATE COMMENT
export const createComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  let comment = await addComment({
    videoId,
    userId: req.user._id,
    content,
  });

  comment = await Comment.findById(comment._id).populate(
    "userId",
    "name avatar"
  );

  res.json({ success: true, comment });
});

// REPLY TO COMMENT
export const replytoComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { videoId, content } = req.body;

  let reply = await addReply({
    videoId,
    userId: req.user._id,
    content,
    parentId: commentId,
  });

  reply = await Comment.findById(reply._id).populate("userId", "name avatar");

  res.json({ success: true, reply });
});

// FETCH COMMENTS
export const fetchComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const comments = await getVideoComments(videoId, page, limit);

  res.json({ success: true, comments });
});

// FETCH REPLIES
export const fetchReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await getReplies(commentId);

  res.json({ success: true, replies });
});

// DELETE COMMENT
export const removeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const result = await deleteComment(commentId, req.user._id);

  if (!result.success) return res.status(403).json(result);

  res.json({ success: true, message: "Comment deleted" });
});
