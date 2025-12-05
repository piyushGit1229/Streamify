// src/middleware/multer.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Fix dirname for Windows (remove starting slash)
let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (__dirname.startsWith("/")) {
  __dirname = __dirname.slice(1); // remove the leading "/"
}

// Now build correct path:
const tempDir = path.join(__dirname, "..", "uploads", "temp");

// Auto create folder if missing
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("Created upload temp folder:", tempDir);
}

// Storage handler
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

// Only allow video files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});
