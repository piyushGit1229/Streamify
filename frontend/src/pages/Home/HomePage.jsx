import { useEffect, useState } from "react";
import { getHomeFeed } from "../../api/feedApi";
import VideoCard from "../../components/video/VideoCard";
import Skeleton from "../../components/common/Skeleton";

export default function HomePage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getHomeFeed()
      .then((res) => {
        const { fromsubsrciption, trending, recommended } = res.data;

        // Merge + Remove duplicates by _id
        const all = [...fromsubsrciption, ...trending, ...recommended];

        const unique = Array.from(
          new Map(all.map((v) => [v._id, v])).values()
        );

        setVideos(unique);
      })
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0)
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );

  // Limit to 3 videos for homepage
  const featuredVideos = videos.slice(0, 100);

  return (
    <div className="p-6 bg-black backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuredVideos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}
