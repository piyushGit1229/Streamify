import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import {
  createNewPlaylist,
  myPlaylists,
  getPlaylist,
  addVideo,
  removeVideo,
  removePlaylist,
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

// Create playlist
router.post("/", createNewPlaylist);

// Get my playlists
router.get("/my", myPlaylists);

// Get playlist details (own or public)
router.get("/:playlistId", getPlaylist);

// Add video to playlist
router.post("/:playlistId/add/:videoId", addVideo);

// Remove video from playlist
router.delete("/:playlistId/remove/:videoId", removeVideo);

// Delete entire playlist
router.delete("/:playlistId", removePlaylist);

export default router;
