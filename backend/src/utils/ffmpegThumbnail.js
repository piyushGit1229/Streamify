// src/utils/ffmpegThumbnail.js
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs/promises";

// ---- SET PATHS ----
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath("C:/ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffprobe.exe");
// -------------------

export const generateThumbnailAndMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const { duration } = metadata.format;
      const stream = metadata.streams.find((s) => s.codec_type === "video");
      const width = stream ? stream.width : null;
      const height = stream ? stream.height : null;

      // thumbnail path
      const thumbName = `${Date.now()}-thumb.png`;
      // const thumbPath = path.join("src/uploads/temp", thumbName);
      const thumbPath = path.join(process.cwd(), "src", "uploads", "temp", thumbName);


      const atTime = Math.min(2, Math.floor(duration / 2) || 1);

      ffmpeg(filePath)
        .screenshots({
          timestamps: [atTime],
          filename: thumbName,
          folder: path.dirname(thumbPath),
          size: "640x?"
        })
        .on("end", async () => {
          try {
            await fs.access(thumbPath);
            resolve({
              thumbnailPath: thumbPath,
              duration: Math.floor(duration),
              width,
              height
            });
          } catch (e) {
            reject(e);
          }
        })
        .on("error", (e) => reject(e));
    });
  });
};
