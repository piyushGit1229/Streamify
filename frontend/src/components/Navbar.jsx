import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { searchVideos } from "../api/videoApi";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* ---------------- SEARCH (DEBOUNCED) ---------------- */
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setShowDropdown(false);
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchVideos(searchQuery, 1, 5);
        setResults(res.data.videos || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  /* ---------------- CLOSE DROPDOWN WHEN CLICK OUTSIDE ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- SEARCH RESULT CLICK ---------------- */
  const handleResultClick = (id) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/watch/${id}`);
  };

  /* ---------------- GOTO PROFILE ---------------- */
  const goToProfile = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 
                    bg-gradient-to-r from-[#101014] to-[#1a1a1f] 
                    border-b border-[#3b82f6]/20 relative z-50">

      {/* LEFT — LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xl font-bold text-white">Streamify</span>
      </Link>

      {/* CENTER — SEARCH */}
      <div className="flex-1 max-w-xl mx-6 relative">
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1f] 
                         border border-[#2a2a32] rounded-l-full 
                         text-white placeholder-gray-400 
                         focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Loading spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 
                       rounded-r-full text-white transition-all"
            onClick={() => {
              if (query.trim()) navigate(`/search?q=${query}`);
              setShowDropdown(false);
            }}
          >
            Search
          </button>
        </div>

        {/* SEARCH DROPDOWN */}
        {showDropdown && results.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full mt-2 w-full bg-[#1a1a1f] border 
                       border-[#2a2a32] rounded-xl shadow-xl overflow-y-auto z-50"
          >
            {results.map((video) => (
              <div
                key={video._id}
                onClick={() => handleResultClick(video._id)}
                className="flex gap-3 items-center p-3 cursor-pointer 
                           hover:bg-[#2a2a32] transition"
              >
                <img
                  src={video.thumbnailUrl}
                  className="w-12 h-8 rounded object-cover"
                />

                <div className="flex-1 text-white">
                  <p className="text-sm font-medium truncate">
                    {video.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {video.owner?.username || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — AUTH / PROFILE */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition" to="/login">Login</Link>
            <Link className="px-5 py-2 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition" to="/signup">Sign Up</Link>
          </>
        ) : (
          <div className="relative" ref={profileRef}>
            {/* AVATAR BUTTON */}
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 
                         border-blue-500 cursor-pointer hover:scale-105 
                         transition shadow-lg"
            >
              <img
                src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* DROPDOWN MENU */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-3 w-52 bg-[#111]/80 backdrop-blur-xl
                           border border-white/10 rounded-2xl shadow-xl p-2 z-50
                           animate-fade-in"
              >
                {/* Profile */}
                <button
                  onClick={goToProfile}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                             text-white hover:bg-blue-600/20 hover:text-blue-400
                             transition-all duration-300"
                >
                  <FiUser size={20} className="text-blue-400" />
                  <span className="font-medium">Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                             text-red-400 hover:bg-red-600/20 hover:text-red-300
                             transition-all duration-300"
                >
                  <FiLogOut size={20} className="text-red-400" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- DEBOUNCE UTILITY ---------------- */
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
