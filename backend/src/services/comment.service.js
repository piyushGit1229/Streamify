import Comment from "../models/comment.model.js";

// CREATE COMMENT
export async function addComment({ videoId, userId, content }) {
  return await Comment.create({ videoId, userId, content });
}

// CREATE REPLY
export async function addReply({ videoId, userId, content, parentId }) {
  const reply = await Comment.create({
    videoId,
    userId,
    content,
    parentId,
  });

  // Increase repliesCount of parent comment
  await Comment.findByIdAndUpdate(parentId, {
    $inc: { repliesCount: 1 },
  });

  return reply;
}

// GET COMMENTS (only top-level)
export async function getVideoComments(videoId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  return await Comment.find({ videoId, parentId: null })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

// GET REPLIES
export async function getReplies(commentId) {
  return await Comment.find({ parentId: commentId })
    .populate("userId", "name avatar")
    .sort({ createdAt: 1 });
}

// DELETE COMMENT
export async function deleteComment(commentId, userId) {
  const comment = await Comment.findById(commentId);

  if (!comment) return { success: false, message: "Comment not found" };
  if (comment.userId.toString() !== userId.toString())
    return { success: false, message: "Unauthorized delete" };

  await comment.deleteOne();

  return { success: true };
}
