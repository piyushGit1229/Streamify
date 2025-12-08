import RelatedCard from "../../../components/video/RelatedCard";

export default function RelatedVideos({ relatedVideos }) {
  if (!relatedVideos || relatedVideos.length === 0) {
    return (
      <div className="w-[360px] shrink-0">
        <div className="bg-[#111118] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white text-lg font-semibold mb-4">Related Videos</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No related videos found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[360px] shrink-0">
      <div className="bg-[#111118] rounded-2xl p-4 border border-white/5">
        <h3 className="text-white text-lg font-semibold mb-4">Related Videos</h3>
        <div className="space-y-3">
          {relatedVideos.map((video) => (
            <RelatedCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
