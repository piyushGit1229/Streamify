import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieparser());
app.use(morgan("dev"));


import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";
import streamRoutes from "./routes/stream.routes.js";
import interactionRoutes  from "./routes/interaction.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import watchLaterRoutes from "./routes/watchLater.routes.js";
import watchPartyRoutes from "./routes/watchparty.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import exploreRoutes from "./routes/explore.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import cutRoutes from "./routes/cut.routes.js";

app.use("/api/videos",videoRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/stream",streamRoutes);
app.use("/api/interactions",interactionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/playlists",playlistRoutes);
app.use("/api/watch-later",watchLaterRoutes);
app.use("/api/watch-party",watchPartyRoutes);
app.use("/api/feed",feedRoutes);
app.use("/api/explore",exploreRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/cuts", cutRoutes);


app.use((err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong"
    });
});



export default app;