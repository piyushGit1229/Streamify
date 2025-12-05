import { useState } from "react";
import { createCut } from "../../api/cutApi";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CutCreator() {
  const { id: videoId } = useParams();
  const navigate = useNavigate();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [title, setTitle] = useState("");

  const handleSaveCut = async () => {
    if (!start || !end || Number(start) >= Number(end)) {
      toast.error("Invalid start/end time");
      return;
    }

    try {
      await createCut({
        videoId,
        title,
        startSeconds: Number(start),
        endSeconds: Number(end),
      });

      toast.success("Cut saved!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to save cut");
    }
  };

  const handlePlayCut = () => {
    if (!start || !end) return toast.error("Enter start & end times");

    navigate(`/watch/${videoId}?start=${start}&end=${end}`);
  };

  return (
    <div className="bg-[#111]/60 border border-white/10 rounded-xl p-5 mt-6 backdrop-blur-lg shadow-xl">

      <h2 className="text-xl font-semibold mb-3">Create Cut</h2>

      <input
        placeholder="Cut title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-lg bg-black border border-white/10 text-white"
      />

      <div className="flex gap-3 mb-4">
        <input
          placeholder="Start sec"
          type="number"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white"
        />
        <input
          placeholder="End sec"
          type="number"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSaveCut}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Save Cut
        </button>

        <button
          onClick={handlePlayCut}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Play Cut
        </button>
      </div>
    </div>
  );
}
