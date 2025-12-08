import { useEffect, useRef, useState, useCallback } from "react";
import { watchpartySocket } from "../../sockets/watchparty.socket";
import { useAuthStore } from "../../store/authStore";

import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";

export default function WatchPartyVideo({ room, isHost }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekbarRef = useRef(null);
  const { user } = useAuthStore();

  // UI State
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Scrubbing + hover preview
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  // Center play/pause icon
  const [centerIcon, setCenterIcon] = useState(null);
  const triggerCenterIcon = (type) => {
    setCenterIcon(type);
    setTimeout(() => setCenterIcon(null), 500);
  };

  // Speed controller
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  const toggleSpeedMenu = (e) => {
    e.stopPropagation();
    setSpeedMenuOpen((prev) => !prev);
  };

  const changeSpeed = (rate) => {
    const v = videoRef.current;
    if (!v) return;

    v.playbackRate = rate;
    setPlaybackRate(rate);

    // Sync speed (and current time) to others via "seek" type
    emit("seek");
    setSpeedMenuOpen(false);
  };

  // ---------------------------------------------------
  // SOCKET SYNC
  // ---------------------------------------------------
  useEffect(() => {
    if (!room || !user) return;

    watchpartySocket.joinRoom(room.roomCode, user.name, user._id);

    const handleStateChange = (state) => {
      const v = videoRef.current;
      if (!v || state.updatedBy === user.name) return;

      v.currentTime = state.currentTime;
      if (state.playbackRate) {
        v.playbackRate = state.playbackRate;
        setPlaybackRate(state.playbackRate);
      }

      if (state.type === "play") {
        v.play();
        setPlaying(true);
      } else if (state.type === "pause") {
        v.pause();
        setPlaying(false);
      } else if (state.type === "seek") {
        // do not change play/pause state, only position + speed
      }
    };

    const handleInitialState = (state) => {
      const v = videoRef.current;
      if (!v) return;

      v.currentTime = state.currentTime;
      if (state.playbackRate) {
        v.playbackRate = state.playbackRate;
        setPlaybackRate(state.playbackRate);
      }

      if (state.isPlaying) {
        v.play();
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    };

    watchpartySocket.onStateChange(handleStateChange);
    watchpartySocket.onInitialState(handleInitialState);

    return () => {
      watchpartySocket.offStateChange(handleStateChange);
      watchpartySocket.offInitialState(handleInitialState);
      watchpartySocket.leaveRoom(room.roomCode);
    };
  }, [room, user]);

  const emit = (type) => {
    const v = videoRef.current;
    if (!v || !isHost) return;
    // Assumes server accepts (roomCode, currentTime, playbackRate)
    watchpartySocket[type](room.roomCode, v.currentTime, v.playbackRate);
  };

  // ---------------------------------------------------
  // AUTO HIDE CONTROLS
  // ---------------------------------------------------
  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(t);
  }, [showControls]);

  // ---------------------------------------------------
  // PLAY / PAUSE
  // ---------------------------------------------------
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!isPlaying) {
      v.play();
      emit("play");
      triggerCenterIcon("play");
    } else {
      v.pause();
      emit("pause");
      triggerCenterIcon("pause");
    }
    setPlaying((prev) => !prev);
    setShowControls(true);
  }, [isPlaying]);

  // TIME UPDATE
  const updateProgress = () => {
    const v = videoRef.current;
    if (!v || isScrubbing) return;
    setProgress((v.currentTime / v.duration) * 100 || 0);
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---------------------------------------------------
  // SEEK HELPERS (±10 seconds)
  // ---------------------------------------------------
  const seekBackward = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    let target = v.currentTime - 10;
    target = Math.max(0, target);

    v.currentTime = target;
    setProgress((target / v.duration) * 100 || 0);
    emit("seek");
    triggerSeekFlash("back");
    setShowControls(true);
  }, []);

  const seekForward = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    let target = v.currentTime + 10;
    target = Math.min(v.duration || target, target);

    v.currentTime = target;
    setProgress((target / v.duration) * 100 || 0);
    emit("seek");
    triggerSeekFlash("forward");
    setShowControls(true);
  }, []);

  // Seek flash (+10 / -10)
  const [seekFlash, setSeekFlash] = useState(null);
  const triggerSeekFlash = (type) => {
    setSeekFlash(type);
    setTimeout(() => setSeekFlash(null), 350);
  };

  // ---------------------------------------------------
  // SCRUBBING
  // ---------------------------------------------------
  const scrubToPointer = (e) => {
    const bar = seekbarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    let pos = e.clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    const percent = pos / rect.width;
    setProgress(percent * 100);

    const v = videoRef.current;
    if (v && v.duration) {
      v.currentTime = percent * v.duration;
    }
  };

  const startScrub = (e) => {
    e.preventDefault();
    setIsScrubbing(true);
    scrubToPointer(e);
    window.addEventListener("pointermove", scrubToPointer);
    window.addEventListener("pointerup", endScrub);
  };

  const endScrub = () => {
    setIsScrubbing(false);
    emit("seek");
    window.removeEventListener("pointermove", scrubToPointer);
    window.removeEventListener("pointerup", endScrub);
  };

  // HOVER PREVIEW
  const showHoverPreview = (e) => {
    const bar = seekbarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverX(pos);

    const percent = pos / rect.width;
    const v = videoRef.current;
    if (!v?.duration) return;

    setHoverTime(percent * v.duration);
  };

  // FULLSCREEN
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
    setShowControls(true);
  };

  // ---------------------------------------------------
  // KEYBOARD SHORTCUTS (YouTube style)
  // ---------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      const v = videoRef.current;
      if (!v) return;

      // Speed shortcuts
      if (e.shiftKey && e.key === ">") {
        e.preventDefault();
        const newRate = Math.min(playbackRate + 0.25, 2);
        changeSpeed(newRate);
        setShowControls(true);
        return;
      }
      if (e.shiftKey && e.key === "<") {
        e.preventDefault();
        const newRate = Math.max(playbackRate - 0.25, 0.25);
        changeSpeed(newRate);
        setShowControls(true);
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
          setVolume(v.muted ? 0 : v.volume);
          break;
        case "ArrowDown":
          e.preventDefault();
          v.volume = Math.max(0, v.volume - 0.05);
          setVolume(v.muted ? 0 : v.volume);
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M": {
          e.preventDefault();
          v.muted = !v.muted;
          setVolume(v.muted ? 0 : v.volume);
          break;
        }
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }

      setShowControls(true);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playbackRate, seekBackward, seekForward, togglePlay]);

  // ---------------------------------------------------
  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl"
      onClick={togglePlay}
      onMouseMove={() => setShowControls(true)}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={room?.video?.videoUrl}
        className="w-full h-full"
        onLoadedMetadata={(e) => {
          setDuration(e.target.duration);
          e.target.playbackRate = playbackRate;
        }}
        onTimeUpdate={updateProgress}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* CENTER PLAY / PAUSE ICON */}
      {centerIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 p-6 rounded-full">
            {centerIcon === "play" ? (
              <FiPlay size={60} className="text-white" />
            ) : (
              <FiPause size={60} className="text-white" />
            )}
          </div>
        </div>
      )}

      {/* SEEK FLASH (+/-10) */}
      {seekFlash && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-5xl font-bold animate-pulse">
            {seekFlash === "forward" ? "⟳ 10" : "⟲ 10"}
          </div>
        </div>
      )}

      {/* FLOATING CONTROLS */}
      <div
        className={`absolute bottom-4 left-0 right-0 transition-all duration-300 ${
          showControls || isScrubbing
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex flex-col gap-3 px-6">

          {/* SEEK BAR */}
          <div
            ref={seekbarRef}
            className="relative w-full h-4 cursor-pointer group"
            onPointerDown={startScrub}
            onMouseMove={showHoverPreview}
            onMouseLeave={() => setHoverTime(null)}
          >
            {/* Track */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-white/20 rounded-full" />

            {/* Progress */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />

            {/* Thumb */}
            <div
              className="
                absolute top-1/2 -translate-y-1/2 w-4 h-4 
                bg-blue-500 rounded-full shadow-lg 
                opacity-0 group-hover:opacity-100 transition-all
              "
              style={{ left: `calc(${progress}% - 8px)` }}
            />

            {/* Tooltip */}
            {hoverTime !== null && (
              <div
                className="
                  absolute -top-8 px-2 py-1 rounded-md 
                  bg-black/80 text-white text-xs
                "
                style={{ left: hoverX - 20 }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* CONTROLS ROW */}
          <div className="flex items-center justify-between text-white">

            <div className="flex items-center gap-4">

              {/* -10s */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seekBackward();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {/* simple text icon; you can swap with custom svg */}
                ⟲10
              </button>

              {/* Play / Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>

              {/* +10s */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  seekForward();
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                10⟳
              </button>

              {/* Volume */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const v = videoRef.current;
                  v.muted = !v.muted;
                  setVolume(v.muted ? 0 : v.volume);
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>

              {/* Time */}
              <span className="text-xs text-gray-300 font-medium">
                {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
              </span>

              {/* SPEED BUTTON */}
              <div className="relative">
                <button
                  onClick={toggleSpeedMenu}
                  className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
                >
                  <span className="text-white text-sm font-semibold">
                    {playbackRate}x
                  </span>
                </button>

                {speedMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-12 left-0 bg-black/70 backdrop-blur-xl rounded-xl p-3 w-32 z-40 flex flex-col gap-1 animate-fadeIn"
                  >
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`px-3 py-1 rounded-lg text-left text-sm transition ${
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
            </div>

            {/* Fullscreen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
            >
              {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
