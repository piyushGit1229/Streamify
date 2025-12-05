import { useState, useEffect } from "react";
import { uploadVideo } from "../api/videoApi";
import { useAuthStore } from "../store/authStore";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

export default function UploadPage() {
  const { user } = useAuthStore();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // -------------------------------
  // 3D Page Parallax
  // -------------------------------
  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // -------------------------------
  // File logic
  // -------------------------------
  const handleFile = (file) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleInfo = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  // -------------------------------
  // Upload Video
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !info.title.trim()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("video", file);
      data.append("title", info.title);
      data.append("description", info.description);
      data.append("tags", info.tags);

      await uploadVideo(data);
      alert("Upload successful!");

      // Reset
      setFile(null);
      setPreview("");
      setInfo({ title: "", description: "", tags: "" });
    } catch (err) {
      alert("Video upload failed.");
    }
    setLoading(false);
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Please log in to upload videos.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#0f0f12] flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Background Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[450px] h-[450px] bg-[#2563eb]/20 blur-3xl rounded-full animate-pulse"
          style={{ top: "20%", left: "15%", transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}
        />
        <div
          className="absolute w-[350px] h-[350px] bg-[#3b82f6]/20 blur-3xl rounded-full animate-pulse"
          style={{ bottom: "10%", right: "20%", transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)` }}
        />
      </div>

      {/* Main Upload Modal */}
      <div
        className="relative z-10 w-full max-w-4xl bg-[#1a1a1f]/80 backdrop-blur-2xl border border-[#2a2a32] rounded-3xl shadow-2xl p-10 flex flex-col lg:flex-row gap-10 transition-transform duration-300"
        style={{
          transform: `perspective(1000px) rotateX(${mouse.y * 0.05}deg) rotateY(${mouse.x * 0.05}deg)`
        }}
      >

        {/* LEFT — Upload Area */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-6">Upload video</h1>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="group border-2 border-dashed border-[#3b82f6]/40 hover:border-[#3b82f6] transition-all cursor-pointer rounded-2xl p-10 bg-[#0f0f12]/40 text-center"
          >
            {!preview ? (
              <label className="flex flex-col items-center cursor-pointer space-y-4">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {/* Upload Icon */}
                <div className="w-24 h-24 rounded-full bg-[#3b82f6]/10 flex items-center justify-center group-hover:bg-[#3b82f6]/20">
                  <svg className="w-12 h-12 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4L5 12h4v6h6v-6h4z" />
                  </svg>
                </div>

                <div>
                  <p className="text-white text-lg">Drag & drop video files to upload</p>
                  <p className="text-gray-500 text-sm">Your video will be private until published</p>
                </div>

                <Button className="px-6 py-3 mt-2 bg-white text-black rounded-full shadow-md hover:opacity-90">
                  Select files
                </Button>
              </label>
            ) : (
              <div className="space-y-4">
                <video
                  src={preview}
                  controls
                  className="w-full rounded-xl border border-gray-700"
                />
                <button
                  className="text-red-400 hover:underline"
                  onClick={() => {
                    setPreview("");
                    setFile(null);
                  }}
                >
                  Remove selected video
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Metadata Fields */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">

          {/* Title */}
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Title</label>
            <input
              type="text"
              name="title"
              value={info.title}
              onChange={handleInfo}
              placeholder="Add a catchy and descriptive title…"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f]/60 border border-[#2a2a32] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#3b82f6] outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Description</label>
            <textarea
              name="description"
              value={info.description}
              onChange={handleInfo}
              rows="5"
              placeholder="Tell viewers what your video is about. Include important points, timestamps, or credits…"
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f]/60 border border-[#2a2a32] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#3b82f6] outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Tags</label>
            <input
              type="text"
              name="tags"
              value={info.tags}
              onChange={handleInfo}
              placeholder="Add tags to help people find your video (e.g. tech, coding, comedy)…"
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f]/60 border border-[#2a2a32] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#3b82f6] outline-none transition-all"
            />
          </div>

          {/* Upload Button */}
          {file && (
            <Button
              loading={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white py-3 rounded-xl shadow-lg hover:opacity-90 text-lg"
            >
              {loading ? <Spinner /> : "Upload Video"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
