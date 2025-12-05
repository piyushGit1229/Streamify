import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import { homeFeed } from "../controllers/feed.controller.js";


const router = express.Router();

router.use(authMiddleware);

router.get("/home", homeFeed);

export default router;
