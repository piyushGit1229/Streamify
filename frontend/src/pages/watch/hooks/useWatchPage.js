import { useEffect, useState } from "react";
import { getVideo } from "../../../api/videoApi";
import { getHomeFeed } from "../../../api/feedApi";
import { channelPage } from "../../../api/subscriptionApi";
import { getComments } from "../../../api/commentApi";
import { useComments } from "./useComments";
import { useVideoActions } from "./useVideoActions";
import { useChannelSubscription } from "./useChannelSubscription";

export function useWatchPage(id) {
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    comments,
    setComments,
    replies,
    showReplies,
    replyFormVisibility,
    setReplyFormVisibility,
    handleReply,
    toggleReplies
  } = useComments(id);

  const { handleLike, handleDislike } = useVideoActions(video, setVideo);
  const { handleSubscribe, handleUnsubscribe } =
    useChannelSubscription(video, channel, setChannel, setVideo);

  // -----------------------------
  // FETCH VIDEO + CHANNEL + FEED
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // ⭐ INCREMENT VIEW COUNT EXACTLY ONCE
        const res = await getVideo(id, true);
        setVideo(res.data.video);

        // CHANNEL INFO
        const channelRes = await channelPage(res.data.video.owner._id);
        setChannel(channelRes.data);

        // COMMENTS
        const commentsRes = await getComments(id);
        setComments(commentsRes.data.comments);

        // FEED (RELATED VIDEOS)
        const feedRes = await getHomeFeed();

        let allVideos = [];

        const sub = Array.isArray(feedRes.data?.fromsubscription)
          ? feedRes.data.fromsubscription
          : [];

        const trending = Array.isArray(feedRes.data?.trending)
          ? feedRes.data.trending
          : [];

        const recommended = Array.isArray(feedRes.data?.recommended)
          ? feedRes.data.recommended
          : [];

        allVideos = [...sub, ...trending, ...recommended];

        

        const filtered = allVideos.filter((v) => v._id !== id);

        setRelatedVideos(filtered);
      } catch (error) {
        console.error("WATCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // -----------------------------
  // RETURN VALUES FOR WATCH PAGE
  // -----------------------------
  return {
    video,
    channel,
    relatedVideos,
    loading,

    comments,
    setComments,
    replies,
    showReplies,
    replyFormVisibility,
    setReplyFormVisibility,

    handleLike,
    handleDislike,
    handleSubscribe,
    handleUnsubscribe,

    handleReply,
    toggleReplies,
  };
}
