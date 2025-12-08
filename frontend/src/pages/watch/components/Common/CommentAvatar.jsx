export default function CommentAvatar({ user, size = "w-8 h-8" }) {
  const avatarUrl = user?.avatar || user?.profilePicture;

  return (
    <div className={`${size} rounded-full overflow-hidden bg-gray-600 flex items-center justify-center`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-sm font-semibold">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
