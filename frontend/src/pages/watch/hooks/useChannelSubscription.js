import { subscribe, unsubscribe } from "../../../api/subscriptionApi";

export function useChannelSubscription(video, channel, setChannel, setVideo) {
  async function handleSubscribe() {
    const res = await subscribe(video.owner._id);
    update(res.data);
  }

  async function handleUnsubscribe() {
    const res = await unsubscribe(video.owner._id);
    update(res.data);
  }

  function update(data) {
    setChannel(prev => ({
      ...prev,
      channel: { ...prev.channel, subscribersCount: data.subscriberCount },
      isSubscribed: data.isSubscribed
    }));

    setVideo(prev => ({ ...prev, isSubscribed: data.isSubscribed }));
  }

  return { handleSubscribe, handleUnsubscribe };
}
