import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

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

  // NEW: Center tap Play/Pause Indicator
  const [centerIcon, setCenterIcon] = useState(null);

  const triggerCenterIcon = (type) => {
    setCenterIcon(type);
    setTimeout(() => setCenterIcon(null), 500);
  };

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = async () => {
      setDuration(video.duration);

      if (startSeconds !== null) {
        video.currentTime = startSeconds;
        setCurrent(startSeconds);
      }

      try {
        await video.play();
        setPlaying(true);
      } catch {
        video.muted = true;
        setMuted(true);
        try {
          await video.play();
          setPlaying(true);
        } catch {}
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [startSeconds]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lock = false;

    const handleSeeking = () => {
      if (lock) return;

      if (startSeconds !== null && video.currentTime < startSeconds) {
        lock = true;
        video.currentTime = startSeconds;
        setTimeout(() => (lock = false), 50);
      }

      if (endSeconds !== null && video.currentTime > endSeconds) {
        lock = true;
        video.currentTime = endSeconds;
        setTimeout(() => (lock = false), 50);
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
      triggerCenterIcon("play");
    } else {
      v.pause();
      setPlaying(false);
      triggerCenterIcon("pause");
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
    const t = Number(e.target.value);
    if (startSeconds !== null && t < startSeconds) return;
    if (endSeconds !== null && t > endSeconds) return;

    videoRef.current.currentTime = t;
    setCurrent(t);
    setShowControls(true);
  };

  const format = (time) => {
    if (!time && time !== 0) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group rounded-xl overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay} // tap to play/pause
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full rounded-xl select-none"
      />

      {/* CENTER PLAY/PAUSE ICON */}
      {centerIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 p-6 rounded-full">
            {centerIcon === "play" ? (
              <Play size={60} className="text-white" />
            ) : (
              <Pause size={60} className="text-white" />
            )}
          </div>
        </div>
      )}

      {/* CLEAN FLOATING CONTROLS, NO BACKGROUND */}
      <div
        className={`absolute bottom-4 left-0 right-0 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex flex-col gap-3 px-6">

          {/* Seekbar */}
          <input
            type="range"
            min={startSeconds ?? 0}
            max={endSeconds ?? duration}
            value={current}
            onChange={handleSeek}
            className="
              w-full h-1.5 cursor-pointer rounded-full accent-blue-500
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-500
            "
          />

          {/* Bottom Controls */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {playing ? (
                  <Pause size={22} className="text-white" />
                ) : (
                  <Play size={22} className="text-white" />
                )}
              </button>

              {/* Time */}
              <span className="text-white text-sm font-medium">
                {format(current)} / {format(endSeconds ?? duration)}
              </span>

              {/* Mute */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {muted ? (
                  <VolumeX size={22} className="text-white" />
                ) : (
                  <Volume2 size={22} className="text-white" />
                )}
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
            >
              {fullscreen ? (
                <Minimize size={22} className="text-white" />
              ) : (
                <Maximize size={22} className="text-white" />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
