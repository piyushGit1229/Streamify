import express from "express";
import {
  createComment,
  replytoComment,
  fetchComments,
  fetchReplies,
  removeComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/:videoId", authMiddleware, createComment);
router.get("/:videoId", fetchComments);

router.post("/reply/:commentId", authMiddleware, replytoComment);
router.get("/replies/:commentId", fetchReplies);

router.delete("/:commentId", authMiddleware, removeComment);

export default router;
