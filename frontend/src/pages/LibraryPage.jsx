import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useLibraryStore } from "../store/libraryStore";
import HistoryPage from "./Library/HistoryPage";
import PlaylistsPage from "./Library/PlaylistsPage";
import WatchLaterPage from "./Library/WatchLaterPage";
import LikedPage from "./Library/LikedPage";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const { historyCount, playlistsCount, watchLaterCount, likedCount } = useLibraryStore();
  const [activeTab, setActiveTab] = useState("history");

  const tabs = [
    { id: "history", label: "History", count: historyCount, component: HistoryPage },
    { id: "playlists", label: "Playlists", count: playlistsCount, component: PlaylistsPage },
    { id: "watchlater", label: "Watch Later", count: watchLaterCount, component: WatchLaterPage },
    { id: "liked", label: "Liked Videos", count: likedCount, component: LikedPage },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Sign in to access your library</h2>
          <p className="text-gray-400">Your personal video collection awaits</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            📚 Your Library
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Manage your videos, playlists, and watch history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-t-lg font-medium transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-700 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
