import { likeVideo, dislikeVideo } from "../../../api/interactionApi";

export function useVideoActions(video, setVideo) {

  async function handleLike() {
    if (!video) return;

    const res = await likeVideo(video._id);
    setVideo(prev => ({ ...prev, ...res.data }));
  }

  async function handleDislike() {
    if (!video) return;

    const res = await dislikeVideo(video._id);
    setVideo(prev => ({ ...prev, ...res.data }));
  }

  return { handleLike, handleDislike };
}
