import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function WatchPartyTest() {
  const socketRef = useRef(null);
  const videoRef = useRef(null);

  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("Piyush");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // STEP 1 → Connect Socket
  useEffect(() => {
   socketRef.current = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});


    // Listen for playback state
    socketRef.current.on("watchparty:state", (state) => {
      console.log("STATE RECEIVED:", state);
      const video = videoRef.current;

      video.currentTime = state.currentTime;
      video.playbackRate = state.playbackRate;

      if (state.type === "play") video.play();
      if (state.type === "pause") video.pause();
    });

    socketRef.current.on("watchparty:initial-state", (state) => {
      console.log("INITIAL STATE:", state);
      const video = videoRef.current;
      video.currentTime = state.currentTime;
      if (state.isPlaying) video.play();
    });

    socketRef.current.on("watchparty:chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // STEP 2 → Join Room
  const joinRoom = () => {
    socketRef.current.emit("watchparty:join", { roomCode, username });
  };

  // STEP 3 → Emit play/pause/seek
  const playVideo = () => {
    socketRef.current.emit("watchparty:play", {
      roomCode,
      currentTime: videoRef.current.currentTime,
      playbackRate: 1,
    });
  };

  const pauseVideo = () => {
    socketRef.current.emit("watchparty:pause", {
      roomCode,
      currentTime: videoRef.current.currentTime,
      playbackRate: 1,
    });
  };

  const seekVideo = () => {
    socketRef.current.emit("watchparty:seek", {
      roomCode,
      currentTime: videoRef.current.currentTime,
      playbackRate: 1,
    });
  };

  // Chat send
  const sendChat = () => {
    socketRef.current.emit("watchparty:chat", {
      roomCode,
      message: chatInput,
    });
    setChatInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Watch Party Test</h2>

      <input
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <button onClick={joinRoom}>Join Room</button>

      <br /><br />

      <video
        ref={videoRef}
        width="400"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        controls
      />

      <br />

      <button onClick={playVideo}>Emit Play</button>
      <button onClick={pauseVideo}>Emit Pause</button>
      <button onClick={seekVideo}>Emit Seek</button>

      <h3>Chat</h3>
      <input
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Message..."
      />
      <button onClick={sendChat}>Send</button>

      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m.username}: {m.message}</li>
        ))}
      </ul>
    </div>
  );
}
