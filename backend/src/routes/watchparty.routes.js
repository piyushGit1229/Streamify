import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import {
  createRoom,
  joinRoom,
  getRoom,
} from "../controllers/watchparty.controller.js";

const router = express.Router();

// all routes require auth (optional: join can be public)
router.use(authMiddleware);

// create room
router.post("/create", createRoom);

// join room (by code)
router.post("/join", joinRoom);

// get room info (for watch party page)
router.get("/:roomCode", getRoom);

export default router;
