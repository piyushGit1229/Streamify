import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";

import {
    addWatchLater,
    removeWatchLater,
    listWatchLater
} from "../controllers/watchLater.controller.js";


const router = express.Router();

router.use(authMiddleware);

router.post("/:videoId", addWatchLater);;
router.delete("/:videoId", removeWatchLater);
router.get("/", listWatchLater);

export default router;