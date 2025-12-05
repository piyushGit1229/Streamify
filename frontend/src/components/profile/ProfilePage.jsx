import { useEffect, useState } from "react";
import { useProfileStore } from "../../store/profileStore";

export default function ProfilePage() {
  const { user, loading, fetchProfile, updateInfo, changeAvatar, changeBanner } =
    useProfileStore();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDesc(user.channelDescription || "");
    }
  }, [user]);

  if (loading || !user)
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );

  // Convert file → Base64
  const toBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toBase64(file, async (base64) => {
      setAvatarPreview(base64);
      await changeAvatar(base64);
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toBase64(file, async (base64) => {
      setBannerPreview(base64);
      await changeBanner(base64);
    });
  };

  const handleSave = async () => {
    await updateInfo({ name, channelDescription: desc });
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* BANNER */}
        <div className="relative w-full h-64 rounded-2xl overflow-hidden group shadow-xl">
          <img
            src={bannerPreview || user.channelBanner || ""}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          <label className="absolute bottom-4 right-4 px-4 py-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer backdrop-blur-xl hover:bg-white/20 transition text-sm font-medium">
            Change Banner
            <input type="file" className="hidden" onChange={handleBannerChange} />
          </label>

          {/* Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* AVATAR + NAME */}
        <div className="flex items-center gap-8 mt-6">
          <div className="relative w-32 h-32">
            <img
              src={avatarPreview || user.avatar || "https://via.placeholder.com/80"}
              className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-xl"
            />

            <label className="absolute bottom-1 right-1 px-3 py-1 bg-white/10 border border-white/20 rounded-xl cursor-pointer backdrop-blur-xl text-xs hover:bg-white/20 transition">
              Edit
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-gray-400 mt-1 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {user.subscribersCount} subscribers
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-10 bg-[#0f0f0f] p-8 rounded-2xl border border-white/10 shadow-xl max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6">Edit Channel Details</h2>

          <label className="text-sm text-gray-400">Name</label>
          <input
            className="w-full p-3 mt-2 bg-black border border-white/20 rounded-xl focus:outline-none focus:border-blue-600 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-sm text-gray-400 mt-5 block">Channel Description</label>
          <textarea
            className="w-full p-3 mt-2 bg-black border border-white/20 rounded-xl h-32 resize-none focus:outline-none focus:border-blue-600 transition"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            onClick={handleSave}
            className="mt-8 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold w-full shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
