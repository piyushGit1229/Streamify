import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { searchVideos } from "../api/videoApi";
import { FiUser, FiLogOut } from "react-icons/fi";

/* ---------------- DEBOUNCE UTILITY ---------------- */
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

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

        // Accepts backend format { data: [...] } or { videos: [...] }
        const list = res?.data?.data || res?.data?.videos || [];

        setResults(list);
        setShowDropdown(true);
      } catch (err) {
        console.error("SEARCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  /* ---------------- CLOSE DROPDOWNS WHEN CLICK OUTSIDE ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- RESULT CLICK ---------------- */
  const handleResultClick = (id) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/watch/${id}`);
  };

  /* ---------------- PROFILE NAVIGATION ---------------- */
  const goToProfile = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  /* ---------------- RENDER NAVBAR ---------------- */
  return (
    <div
      className="
        w-full h-16 flex items-center justify-between px-6 
        bg-gradient-to-r from-[#101014] to-[#1a1a1f] 
        border-b border-[#3b82f6]/20 relative z-50
      "
    >
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xl font-bold text-white">Streamify</span>
      </Link>

      {/* ------------------ SEARCH SECTION (CENTER) ------------------ */}
      <div className="flex-1 max-w-xl mx-6 relative">
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search videos..."
              className="
                w-full pl-12 pr-4 py-2 
                bg-white/5 backdrop-blur-xl
                border border-white/10 
                rounded-l-full 
                text-white placeholder-gray-400 
                focus:outline-none 
                focus:ring-2 focus:ring-blue-500
                transition-all
              "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setShowDropdown(true)}
            />

            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            className="
              px-6 py-2 rounded-r-full 
              bg-blue-600 hover:bg-blue-700 
              text-white transition-all 
              border border-blue-500/50
            "
            onClick={() => {
              if (query.trim()) navigate(`/search?q=${query}`);
              setShowDropdown(false);
            }}
          >
            Search
          </button>
        </div>

        {/* ------------------ SEARCH DROPDOWN ------------------ */}
        {showDropdown && results.length > 0 && (
          <div
            ref={dropdownRef}
            className="
              absolute top-full mt-3 w-full 
              bg-black/40 backdrop-blur-2xl 
              border border-white/10 
              rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] 
              overflow-hidden z-50 animate-fade-in
            "
          >
            {results.map((video) => (
              <div
                key={video._id}
                onClick={() => handleResultClick(video._id)}
                className="
                  flex gap-4 items-center p-3 cursor-pointer 
                  hover:bg-white/10 transition-all
                "
              >
                <img
                  src={video.thumbnailUrl}
                  className="w-20 h-12 rounded-lg object-cover shadow-md"
                />

                <div className="flex-1 text-white">
                  <p className="text-sm font-semibold truncate">{video.title}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {video.owner?.name || "Unknown Channel"}
                  </p>
                </div>
              </div>
            ))}

            {/* View All */}
            <button
              className="
                w-full py-2 text-center text-blue-400 
                hover:bg-white/10 transition rounded-b-2xl
                text-sm font-medium
              "
              onClick={() => navigate(`/search?q=${query}`)}
            >
              View all results →
            </button>
          </div>
        )}
      </div>

      {/* ------------------ RIGHT (AUTH & PROFILE) ------------------ */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition" to="/login">
              Login
            </Link>
            <Link className="px-5 py-2 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition" to="/signup">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="
                w-10 h-10 rounded-full overflow-hidden border-2 
                border-blue-500 cursor-pointer hover:scale-105 
                transition shadow-lg
              "
            >
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
              />
            </div>

            {/* PROFILE DROPDOWN */}
            {showProfileMenu && (
              <div
                className="
                  absolute right-0 mt-3 w-52 
                  bg-[#111]/80 backdrop-blur-xl
                  border border-white/10 rounded-2xl 
                  shadow-xl p-2 z-50 animate-fade-in
                "
              >
                <button
                  onClick={goToProfile}
                  className="
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                    text-white hover:bg-blue-600/20 hover:text-blue-400
                    transition-all duration-300
                  "
                >
                  <FiUser size={20} className="text-blue-400" />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={logout}
                  className="
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                    text-red-400 hover:bg-red-600/20 hover:text-red-300
                    transition-all duration-300
                  "
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
