import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import{
    likeVideo,
    dislikeVideo,
    myLikedVideos,
    myDislikedVideos
} from "../controllers/interaction.controller.js";


const router = express.Router();

router.use(authMiddleware); //only allow authenticated users to like dislike

router.post("/like/:videoId", likeVideo);
router.post("/dislike/:videoId", dislikeVideo);

router.get("/liked", myLikedVideos);
router.get("/disliked", myDislikedVideos);

export default router;
