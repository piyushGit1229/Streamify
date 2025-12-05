import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  updateBanner
} from "../controllers/profile.controller.js";

const router = express.Router();

// All profile routes require authentication
router.use(authMiddleware);

// GET logged-in user profile
router.get("/me", getProfile);

// Update name & channel description
router.put("/update", updateProfile);

// Update avatar (Base64 string)
router.put("/avatar", updateAvatar);

// Update banner (Base64 string)
router.put("/banner", updateBanner);

export default router;
