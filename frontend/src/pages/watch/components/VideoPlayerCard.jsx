import CustomVideoPlayer from "../../../components/video/CustomVideoPlayer";

export default function VideoPlayerCard({ video, onViewsIncremented }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <CustomVideoPlayer id={video._id} src={`/api/stream/${video._id}`} poster={video.thumbnailUrl} />

    </div>
  );
}
