import { useEffect, useState } from "react";
import { getMySubscriptions } from "../../api/subscriptionApi";
import { Link } from "react-router-dom";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Glow effect
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    getMySubscriptions()
      .then((res) => setSubs(res.data.subscriptions))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading subscriptions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 relative overflow-hidden">

      {/* Background Glow */}
      <BackgroundGlow mouse={mouse} />

      <h1 className="text-4xl font-bold mb-10 tracking-wide">Your Subscriptions</h1>

      {/* GRID WITH BIG CIRCLE PROFILES */}
      <div className="
        grid 
        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
        gap-10 
        relative z-10
        place-items-center
      ">
        {subs.map((s) => (
          <Link
            key={s._id}
            to={`/channel/${s.channel._id}`}
            className="
              flex flex-col items-center text-center 
              bg-[#111]/40 border border-white/10 
              rounded-3xl p-6 w-44
              backdrop-blur-xl
              shadow-lg hover:shadow-2xl
              hover:bg-[#1c1c1c]/60
              transition-all duration-300
              cursor-pointer
            "
          >
            {/* BIG CIRCLE IMAGE */}
            <img
              src={s.channel.avatar || 'https://i.pravatar.cc/200'}
              className="
                w-28 h-28 rounded-full object-cover 
                mb-4 shadow-lg 
                transition-transform duration-300 
                group-hover:scale-110
              "
            />

            {/* NAME */}
            <h2 className="text-lg font-semibold group-hover:text-blue-400 transition">
              {s.channel.name}
            </h2>

            {/* SUBSCRIBER COUNT */}
            <p className="text-gray-400 text-sm">
              {s.channel.subscribersCount} subscribers
            </p>
          </Link>
        ))}
      </div>

      <div className="h-20"></div>
    </div>
  );
}

/* ---------------- BACKGROUND GLOW ---------------- */
function BackgroundGlow({ mouse }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[450px] h-[450px] bg-blue-600/20 blur-3xl rounded-full"
        style={{
          top: "10%",
          left: "10%",
          transform: `translate(${mouse.x * 0.7}px, ${mouse.y * 0.7}px)`
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full"
        style={{
          bottom: "8%",
          right: "12%",
          transform: `translate(${mouse.x * -0.6}px, ${mouse.y * -0.6}px)`
        }}
      />
    </div>
  );
}
