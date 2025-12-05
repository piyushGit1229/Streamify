import { useState, useEffect } from "react";
import { getMyPlaylists, addVideoToPlaylist } from "../../api/playlistApi";

export default function AddToPlaylist({ videoId }) {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!open) return;
    getMyPlaylists().then((res) => {
      setPlaylists(res.data.playlists || []);
    });
  }, [open]);

  const handleAdd = async (playlistId, playlistName) => {
    setLoading(true);
    try {
      await addVideoToPlaylist(playlistId, videoId);
      setOpen(false);
    } catch (err) {
      console.log("ADD FAILED:", err);
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#171722] border border-white/10 shadow-md hover:bg-[#1f1f2b] transition text-gray-200"
      >
        📁 Add to Playlist
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-60 bg-[#101018] border border-white/10 rounded-xl shadow-xl z-50 py-2"
        >
          <h3 className="px-4 py-1 text-xs font-semibold uppercase text-gray-400">
            Select Playlist
          </h3>

          <div className="max-h-64 overflow-y-auto">
            {playlists.length === 0 && (
              <p className="text-gray-500 px-4 py-2 text-sm">
                No playlists found.
              </p>
            )}

            {playlists.map((p) => (
              <button
                key={p._id}
                onClick={() => handleAdd(p._id, p.name)}
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#1c1c27] transition flex items-center gap-2"
              >
                ➕ {p.name}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center text-gray-400 text-xs py-2">
              Adding...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
