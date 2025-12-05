import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiTrendingUp,
  FiClock,
  FiList,
  FiHeart,
  FiUpload
} from "react-icons/fi";

import { useAuthStore } from "../../store/authStore";
import { useLibraryStore } from "../../store/libraryStore";

export default function Sidebar() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const { watchLaterCount, playlistsCount } = useLibraryStore();

  const itemClass = (active) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm
     ${active
       ? "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white shadow-md"
       : "text-gray-300 hover:bg-gradient-to-r hover:from-[#1f1f26] hover:to-[#2a2a32] hover:text-white hover:shadow-lg"
     }`;

  return (
    <div
      style={{ width: "280px" }}
      className="fixed left-0 top-0 bg-gradient-to-b from-[#0f0f12] to-[#14141a] text-white h-screen border-r border-[#2a2a32] flex flex-col justify-between shadow-xl z-10"
    >
      {/* Top */}
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent">
              Streamify
            </h1>
          </div>
        </div>

        {/* MENU */}
        <div className="px-4 mb-3 flex-1">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Menu</p>
          <div className="space-y-2">
            <Link to="/" className={itemClass(pathname === "/")}>
              <FiHome size={22} /> Home
            </Link>
            <Link to="/explore" className={itemClass(pathname === "/explore")}>
              <FiCompass size={22} /> Explore
            </Link>
            <Link to="/trending" className={itemClass(pathname === "/trending")}>
              <FiTrendingUp size={22} /> Trending
            </Link>
            <Link to="/upload" className={itemClass(pathname === "/upload")}>
              <FiUpload size={22} /> Upload
            </Link>
          </div>
        </div>

        {/* Separator */}
        <div className="mx-4 my-3 bg-linear-to-r-to-r from-transparent via-[#2a2a32] to-transparent"></div>

        {/* LIBRARY */}
        <div className="px-4 flex-1">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Library</p>
          <div className="space-y-2">
            <Link to="/subscriptions" className={itemClass(pathname === "/subscriptions")}>
              <FiClock size={22} /> Subscriptions
            </Link>
            <Link to="/playlists" className={itemClass(pathname === "/playlists")}>
              <FiList size={22} /> Playlists {playlistsCount > 0 && <span className="text-xs text-gray-400 ml-1">({playlistsCount})</span>}
            </Link>
            <Link to="/mycuts" className={itemClass(pathname === "/mycuts")}>
              <FiClock size={22} /> My Cuts {watchLaterCount > 0 && <span className="text-xs text-gray-400 ml-1">({watchLaterCount})</span>}
            </Link>
            <Link to="/liked" className={itemClass(pathname === "/liked")}>
              <FiHeart size={22} /> Liked Videos
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom User */}
      <div className="px-4 py-6 border-t border-[#2a2a32] bg-gradient-to-t from-[#0f0f12] to-transparent">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1f1f26] shadow-md">
          <img
            src={
              user?.avatar ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            className="w-12 h-12 rounded-full object-cover border-2 border-[#3b82f6]"
          />
          <div>
            <p className="text-sm font-medium text-white">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-gray-400">
              {user ? "Member" : "Not Logged In"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
