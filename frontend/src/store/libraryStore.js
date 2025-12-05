import { create } from "zustand";
import { listWatchLater } from "../api/watchLaterApi";
import { getMyPlaylists } from "../api/playlistApi";

const useLibraryStore = create((set, get) => ({
  watchLaterCount: 0,
  playlistsCount: 0,
  playlists: [],

  fetchLibraryData: async () => {
    try {
      const [watchLaterRes, playlistsRes] = await Promise.all([
        listWatchLater(),
        getMyPlaylists(),
      ]);

      set({
        watchLaterCount: watchLaterRes.data.length,
        playlistsCount: playlistsRes.data.length,
        playlists: playlistsRes.data,
      });
    } catch (error) {
      console.error("Error fetching library data:", error);
    }
  },

  updateWatchLaterCount: (count) => set({ watchLaterCount: count }),
  updatePlaylistsCount: (count) => set({ playlistsCount: count }),
  updatePlaylists: (playlists) => set({ playlists }),
}));

export { useLibraryStore };
