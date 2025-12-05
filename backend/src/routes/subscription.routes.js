import express from "express";

import { authMiddleware } from "../middleware/auth.Middleware.js";
import {
  subscribe,
  unsubscribe,
  mySubscriptions,
  channelSubscribers,
  channelPage,
  subscriptionFeed,
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.use(authMiddleware);

// subscribe to a channel
router.post("/subscribe/:channelId", subscribe);

// unsubscribe
router.post("/unsubscribe/:channelId", unsubscribe);

// get my subscriptions list (channels I follow)
router.get("/my", mySubscriptions);

// get all subscribers of a channel
router.get("/channel/:channelId/subscribers", channelSubscribers);

// channel page data
router.get("/channel/:channelId", channelPage);

// subscription feed (videos from followed channels)
router.get("/feed", subscriptionFeed);

export default router;