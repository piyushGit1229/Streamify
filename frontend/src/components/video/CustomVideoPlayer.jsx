import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function CustomVideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  const [params] = useSearchParams();
  const startSeconds = params.get("start") ? Number(params.get("start")) : null;
  const endSeconds = params.get("end") ? Number(params.get("end")) : null;

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  // Load metadata → jump to start position + auto-play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = async () => {
      setDuration(video.duration);

      // Jump to cut start if exists
      if (startSeconds !== null) {
        video.currentTime = startSeconds;
        setCurrent(startSeconds);
      }

      // Try autoplay
      try {
        await video.play();
        setPlaying(true);
      } catch (err) {
        // Browser blocked autoplay → force muted autoplay
        video.muted = true;
        setMuted(true);

        try {
          await video.play();
          setPlaying(true);
        } catch (finalError) {
          console.warn("Autoplay blocked even when muted:", finalError);
        }
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [startSeconds]);

  // Prevent seeking outside region + stop at end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let block = false;

    const handleSeeking = () => {
      if (block) return;

      if (startSeconds !== null && video.currentTime < startSeconds) {
        block = true;
        video.currentTime = startSeconds;
        setTimeout(() => (block = false), 50);
      }

      if (endSeconds !== null && video.currentTime > endSeconds) {
        block = true;
        video.currentTime = endSeconds;
        setTimeout(() => (block = false), 50);
      }
    };

    const handleTimeUpdate = () => {
      setCurrent(video.currentTime);

      if (endSeconds !== null && video.currentTime >= endSeconds) {
        video.pause();
        setPlaying(false);
        video.currentTime = endSeconds;
      }
    };

    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [startSeconds, endSeconds]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }

    setShowControls(true);
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }

    setShowControls(true);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);

    if (startSeconds !== null && time < startSeconds) return;
    if (endSeconds !== null && time > endSeconds) return;

    videoRef.current.currentTime = time;
    setCurrent(time);
    setShowControls(true);
  };

  const format = (s) => {
    if (s === null || s === undefined) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group rounded-xl overflow-hidden"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full rounded-xl"
      />

      {/* CONTROLS */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full h-28 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end px-5 pb-4">

          {/* Seekbar */}
          <input
            type="range"
            min={startSeconds ?? 0}
            max={endSeconds ?? duration}
            value={current}
            onChange={handleSeek}
            className="w-full h-1.5 cursor-pointer accent-red-600 rounded-full"
          />

          {/* Buttons */}
          <div className="flex items-center justify-between mt-3">

            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white shadow-lg transition"
              >
                {playing ? (
                  <svg width="22" height="22" fill="white">
                    <rect x="5" y="4" width="5" height="14" rx="2" />
                    <rect x="12" y="4" width="5" height="14" rx="2" />
                  </svg>
                ) : (
                  <svg width="22" height="22" fill="white">
                    <polygon points="6,4 18,11 6,18" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="text-white text-sm font-medium">
                {format(current)} / {format(endSeconds ?? duration)}
              </span>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white shadow-lg transition"
              >
                {muted ? "🔈" : "🔊"}
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white shadow-lg transition"
            >
              {fullscreen ? "↙" : "⛶"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
