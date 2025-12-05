import { useEffect, useState } from "react";
import { getMyCuts, deleteCut } from "../../api/cutApi";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiScissors } from "react-icons/fi";

export default function CutsPage() {
  const [cuts, setCuts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCuts()
      .then((res) => setCuts(res.data.cuts || []))
      .catch((error) => {
          console.error("Failed to fetch cuts:", error);
          setCuts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();

  const handlePlayCut = (cut) => {
    // FIX 1: Change cut.videoId to cut.video
    navigate(`/watch/${cut.video._id}?start=${cut.startSeconds}&end=${cut.endSeconds}`);
  };

  const handleDelete = async (cutId) => {
    try {
        await deleteCut(cutId);
        setCuts((prev) => prev.filter((c) => c._id !== cutId));
    } catch (error) {
        console.error("Failed to delete cut:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your cuts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FiScissors size={28} /> My Cuts
      </h1>

      {cuts.length === 0 ? (
        <p className="text-gray-400">You haven't created any cuts yet.</p>
      ) : (
        <div className="space-y-6">
          {cuts.map((cut) => {
                
                // FIX 2: Change cut.videoId to cut.video in the guard check
                if (!cut || !cut.video || !cut.video.thumbnailUrl || !cut.video.title) {
                    console.warn("Skipping cut due to missing video data:", cut);
                    return null; 
                }
                
                return (
                    <div
                        key={cut._id}
                        className="flex gap-4 items-center p-4 bg-[#111] rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition"
                    >
                        {/* Thumbnail */}
                        <img
                            // FIX 3: Change cut.videoId to cut.video
                            src={cut.video.thumbnailUrl} 
                            className="w-40 h-24 rounded-lg object-cover hover:scale-105 transition cursor-pointer"
                            onClick={() => handlePlayCut(cut)}
                            alt={`Thumbnail for ${cut.title || "Cut"}`}
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold line-clamp-1">
                                {cut.title || "Untitled Cut"}
                            </h2>

                            <p className="text-gray-400 text-sm">
                                // FIX 4: Change cut.videoId to cut.video
                                From video: {cut.video.title} 
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                ⏱ {cut.startSeconds}s → {cut.endSeconds}s
                            </p>

                            <button
                                onClick={() => handlePlayCut(cut)}
                                className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            >
                                Play Cut
                            </button>
                        </div>

                        {/* Delete */}
                        <button
                            className="text-gray-400 hover:text-red-500 transition"
                            onClick={() => handleDelete(cut._id)}
                        >
                            <FiTrash2 size={22} />
                        </button>
                    </div>
                );
            })}
      </div>
  )}
</div>
 );
}