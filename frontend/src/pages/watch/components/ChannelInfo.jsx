import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";

export default function ChannelInfo({ video, channel, onSubscribe, onUnsubscribe }) {
  if (!channel) return null;

  const subscribed = channel.isSubscribed;

  return (
    <div className="p-4 bg-[#111118] rounded-2xl border border-white/5 flex items-start gap-4">
      <Link to={`/channel/${video.owner._id}`} className="flex-shrink-0">
        <img
          src={channel.channel.avatar || "https://i.pravatar.cc/50"}
          className="w-12 h-12 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/channel/${video.owner._id}`}>
          <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer">
            {channel.channel.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm">
          {channel.channel.subscribersCount?.toLocaleString()} subscribers
        </p>
      </div>

      <Button
        variant={subscribed ? "secondary" : "primary"}
        onClick={subscribed ? onUnsubscribe : onSubscribe}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
}
