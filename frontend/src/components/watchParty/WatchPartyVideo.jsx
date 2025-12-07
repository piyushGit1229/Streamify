import { useEffect, useRef, useState } from "react";
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
  const { user } = useAuthStore();

  // UI State
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setFullscreen] = useState(false);

  // Scrubbing
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  // NEW → Center play/pause icon
  const [centerIcon, setCenterIcon] = useState(null);
  const triggerCenterIcon = (type) => {
    setCenterIcon(type);
    setTimeout(() => setCenterIcon(null), 500);
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
      v.playbackRate = state.playbackRate;
      state.type === "play" ? v.play() : v.pause();
    };

    const handleInitialState = (state) => {
      const v = videoRef.current;
      if (!v) return;

      v.currentTime = state.currentTime;
      v.playbackRate = state.playbackRate;
      state.isPlaying ? v.play() : v.pause();
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
    watchpartySocket[type](room.roomCode, v.currentTime, v.playbackRate);
  };

  // PLAY / PAUSE
  const togglePlay = () => {
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
    setPlaying(!isPlaying);
  };

  // TIME UPDATE
  const updateProgress = () => {
    const v = videoRef.current;
    if (!isScrubbing) {
      setProgress((v.currentTime / v.duration) * 100 || 0);
    }
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  // SCRUBBING
  const startScrub = (e) => {
    setIsScrubbing(true);
    scrubTo(e);
    window.addEventListener("pointermove", scrubTo);
    window.addEventListener("pointerup", endScrub);
  };

  const scrubTo = (e) => {
    const bar = document.getElementById("yt-seekbar");
    const rect = bar.getBoundingClientRect();

    let pos = e.clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width));

    const percent = pos / rect.width;
    setProgress(percent * 100);

    const v = videoRef.current;
    if (v) v.currentTime = percent * v.duration;
  };

  const endScrub = () => {
    setIsScrubbing(false);
    emit("seek");

    window.removeEventListener("pointermove", scrubTo);
    window.removeEventListener("pointerup", endScrub);
  };

  // HOVER PREVIEW
  const showHoverPreview = (e) => {
    const bar = document.getElementById("yt-seekbar");
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
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl"
      onClick={togglePlay}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={room?.video?.videoUrl}
        className="w-full h-full"
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
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

      {/* FLOATING CLEAN CONTROLS */}
      <div
        className={`absolute bottom-4 left-0 right-0 transition-all duration-300 ${
          isScrubbing ? "opacity-100" : "opacity-100 group-hover:opacity-100"
        }`}
      >
        <div className="w-full flex flex-col gap-3 px-6">

          {/* SEEK BAR */}
          <div
            id="yt-seekbar"
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

              {/* Volume */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const v = videoRef.current;
                  v.muted = !v.muted;
                  setVolume(v.muted ? 0 : 1);
                }}
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
              >
                {volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>

              {/* Time */}
              <span className="text-xs text-gray-300 font-medium">
                {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2.5 rounded-full bg-black/30 hover:bg-black/40 transition"
            >
              {isFullscreen ? (
                <FiMinimize size={18} />
              ) : (
                <FiMaximize size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
