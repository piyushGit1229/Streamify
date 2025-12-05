// src/routes/video.routes.js
import express from "express";
import {
    uploadVideo,
    getVideo,
    trending,
    feed,
    search,
    relatedVideos,
} from "../controllers/video.controller.js";

import { uploadVideo as multerUpload } from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import {Router} from "express";


const router = express.Router();

router.post("/upload", authMiddleware, multerUpload.single("video"), uploadVideo);
router.get("/trending", trending);
router.get("/feed", authMiddleware, feed);
router.get("/search", search);
router.get("/:id/related", relatedVideos);
router.get("/:id", getVideo); // ALWAYS keep this last


export default router;
