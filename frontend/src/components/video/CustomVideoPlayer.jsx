import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { getVideo } from "../../api/videoApi";

export default function CustomVideoPlayer({
  id,
  src,
  poster,
  onViewsIncremented,
}) {
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
  const [viewsIncremented, setViewsIncremented] = useState(false);

  // Center play/pause flash
  const [centerIcon, setCenterIcon] = useState(null);
  const triggerCenterIcon = (icon) => {
    setCenterIcon(icon);
    setTimeout(() => setCenterIcon(null), 500);
  };

  // Seek flash animation
  const [seekFlash, setSeekFlash] = useState(null);
  const triggerSeekFlash = (type) => {
    setSeekFlash(type);
    setTimeout(() => setSeekFlash(null), 350);
  };

  // SPEED CONTROLLER MENU
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const toggleSpeedMenu = (e) => {
    e.stopPropagation();
    setSpeedMenuOpen((p) => !p);
  };

  const changeSpeed = (value) => {
    const v = videoRef.current;
    if (!v) return;

    v.playbackRate = value;
    setPlaybackRate(value);
    setSpeedMenuOpen(false);
  };

  // Auto hide controls
  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(t);
  }, [showControls]);

  // Load meta + autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleLoaded = async () => {
      setDuration(v.duration);

      if (startSeconds !== null) {
        v.currentTime = startSeconds;
        setCurrent(startSeconds);
      }

      try {
        await v.play();
        setPlaying(true);
      } catch {
        v.muted = true;
        setMuted(true);
        try {
          await v.play();
          setPlaying(true);
        } catch {}
      }
    };

    v.addEventListener("loadedmetadata", handleLoaded);
    return () => v.removeEventListener("loadedmetadata", handleLoaded);
  }, [startSeconds]);

  // SEEK LIMITS + VIEW INCREMENT
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let lock = false;

    const handleSeeking = () => {
      if (lock) return;

      if (startSeconds !== null && v.currentTime < startSeconds) {
        lock = true;
        v.currentTime = startSeconds;
        setTimeout(() => (lock = false), 40);
      }

      if (endSeconds !== null && v.currentTime > endSeconds) {
        lock = true;
        v.currentTime = endSeconds;
        setTimeout(() => (lock = false), 40);
      }
    };

    const handleTimeUpdate = () => {
      setCurrent(v.currentTime);

      if (endSeconds !== null && v.currentTime >= endSeconds) {
        v.pause();
        setPlaying(false);
        v.currentTime = endSeconds;
      }
    };

    const handlePlay = async () => {
      if (!viewsIncremented && id) {
        try {
          const res = await getVideo(id, true);
          setViewsIncremented(true);
          onViewsIncremented(res.data.video);
        } catch {}
      }
    };

    v.addEventListener("seeking", handleSeeking);
    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("play", handlePlay);

    return () => {
      v.removeEventListener("seeking", handleSeeking);
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("play", handlePlay);
    };
  }, [startSeconds, endSeconds, viewsIncremented, id]);

  // SEEK BACKWARD
  const seekBackward = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    let t = v.currentTime - 10;
    if (startSeconds !== null) t = Math.max(t, startSeconds);

    v.currentTime = t;
    setCurrent(t);
    triggerSeekFlash("back");
    setShowControls(true);
  }, [startSeconds]);

  // SEEK FORWARD
  const seekForward = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    let t = v.currentTime + 10;
    if (endSeconds !== null) t = Math.min(t, endSeconds);

    v.currentTime = t;
    setCurrent(t);
    triggerSeekFlash("forward");
    setShowControls(true);
  }, [endSeconds]);

  // PLAY/PAUSE
  const togglePlay = useCallback(() => {
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
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowControls(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const w = wrapperRef.current;

    if (!document.fullscreenElement) {
      w.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
    setShowControls(true);
  }, []);

  // Seek bar
  const handleSeek = (e) => {
    const t = Number(e.target.value);

    if (startSeconds !== null && t < startSeconds) return;
    if (endSeconds !== null && t > endSeconds) return;

    videoRef.current.currentTime = t;
    setCurrent(t);
    setShowControls(true);
  };

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handler = (e) => {
      const v = videoRef.current;
      if (!v) return;

      // SHIFT + < >
      if (e.shiftKey && e.key === ">") {
        e.preventDefault();
        changeSpeed(Math.min(playbackRate + 0.25, 2));
        return;
      }
      if (e.shiftKey && e.key === "<") {
        e.preventDefault();
        changeSpeed(Math.max(playbackRate - 0.25, 0.25));
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          seekBackward();
          break;

        case "ArrowRight":
          e.preventDefault();
          seekForward();
          break;

        case "ArrowUp":
          e.preventDefault();
          v.volume = Math.min(1, v.volume + 0.05);
          break;

        case "ArrowDown":
          e.preventDefault();
          v.volume = Math.max(0, v.volume - 0.05);
          break;

        case " ":
        case "Enter":
          e.preventDefault();
          togglePlay();
          break;

        case "m":
        case "M":
          toggleMute();
          break;

        case "f":
        case "F":
          toggleFullscreen();
          break;
      }

      setShowControls(true);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    playbackRate,
    seekBackward,
    seekForward,
    togglePlay,
    toggleMute,
    toggleFullscreen,
  ]);

  const format = (t) => {
    if (!t && t !== 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // =========================================
  // RENDER UI
  // =========================================
  return (
    <div
      ref={wrapperRef}
      className="relative group rounded-xl overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full rounded-xl select-none"
      />

      {/* Center Play/Pause Flash */}
      {centerIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-black/40 p-6 rounded-full">
            {centerIcon === "play" ? (
              <Play size={60} className="text-white" />
            ) : (
              <Pause size={60} className="text-white" />
            )}
          </div>
        </div>
      )}

      {/* Seek Flash */}
      {seekFlash && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-white text-5xl font-bold animate-pulse">
            {seekFlash === "forward" ? "⟳ 10" : "⟲ 10"}
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div
        className={`absolute bottom-4 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex flex-col gap-3 px-6">

          {/* Seek Bar */}
          <input
            type="range"
            min={startSeconds ?? 0}
            max={endSeconds ?? duration}
            value={current}
            onChange={handleSeek}
            className="w-full h-1.5 cursor-pointer rounded-full accent-blue-500"
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              {/* -10 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seekBackward();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition"
              >
                <RotateCcw size={22} className="text-white" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition"
              >
                {playing ? (
                  <Pause size={22} className="text-white" />
                ) : (
                  <Play size={22} className="text-white" />
                )}
              </button>

              {/* +10 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seekForward();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition"
              >
                <RotateCw size={22} className="text-white" />
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
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition"
              >
                {muted ? (
                  <VolumeX size={22} className="text-white" />
                ) : (
                  <Volume2 size={22} className="text-white" />
                )}
              </button>

              {/* SPEED BUTTON */}
              <button
                onClick={toggleSpeedMenu}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition relative"
              >
                <span className="text-white text-sm font-semibold">
                  {playbackRate}x
                </span>
              </button>

              {/* SPEED MENU */}
              {speedMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-16 right-6 bg-black/60 backdrop-blur-xl rounded-xl p-3 w-32 z-40 flex flex-col gap-2 animate-fadeIn"
                >
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeed(rate)}
                      className={`px-3 py-1 rounded-lg text-left transition ${
                        playbackRate === rate
                          ? "bg-blue-500 text-white"
                          : "hover:bg-white/10 text-white"
                      }`}
                    >
                      {rate === 1 ? "Normal" : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FULLSCREEN */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 transition"
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
