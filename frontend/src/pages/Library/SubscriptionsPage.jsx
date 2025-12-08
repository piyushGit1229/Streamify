import { useEffect, useState } from "react";
import { getMySubscriptions } from "../../api/subscriptionApi";
import { Link } from "react-router-dom";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Glow movement for background
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
    <div className="min-h-screen bg-[#030014] text-white p-10 relative overflow-hidden">

      {/* Background Glow */}
      <BackgroundGlow mouse={mouse} />

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <h1 className="text-4xl font-bold tracking-wide">Your Subscriptions</h1>

        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-lg text-sm cursor-pointer hover:bg-white/10 transition">
          Sort by: <span className="text-blue-400">Most active</span> ▼
        </div>
      </div>

      {/* CARD GRID */}
      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-12 
        place-items-center
        relative z-10
      ">
        {subs.map((s) => (
          <Link
            key={s._id}
            to={`/channel/${s.channel._id}`}
            className="
              bg-white/5 
              border border-white/10 
              backdrop-blur-xl
              rounded-3xl 
              p-8 
              w-64
              flex flex-col items-center text-center
              transition-all duration-500
              hover:-translate-y-2 
              hover:shadow-[0_0_35px_rgba(80,80,255,0.25)]
            "
          >
            {/* AVATAR WITH NEON RING */}
            <div className="relative mb-6">
              <div className="
                absolute inset-0 
                rounded-full 
                blur-xl 
                opacity-0 
                transition-all duration-500 
                group-hover:opacity-70
                bg-gradient-to-r from-blue-500 to-purple-500
              "></div>

              <div className="
                w-32 h-32 rounded-full p-[3px]
                bg-gradient-to-r from-blue-500 to-purple-500
              ">
                <img
                  src={s.channel.avatar || 'https://i.pravatar.cc/200'}
                  className="
                    w-full h-full rounded-full object-cover 
                    shadow-xl 
                  "
                />
              </div>
            </div>

            {/* NAME */}
            <h2 className="text-xl font-semibold mb-1">
              {s.channel.name}
            </h2>

            {/* SUBSCRIBER COUNT */}
            <p className="text-gray-400 mb-5 text-sm">
              {s.channel.subscribersCount} subscribers
            </p>

            {/* BUTTON */}
            <div
              className="
                bg-white/5 
                border border-white/10 
                px-5 py-2 
                rounded-xl 
                text-sm 
                hover:bg-white/10 
                transition backdrop-blur-lg
              "
            >
              Visit Channel
            </div>
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
        className="absolute w-[450px] h-[450px] bg-blue-600/20 blur-[140px] rounded-full"
        style={{
          top: "5%",
          left: "10%",
          transform: `translate(${mouse.x * 0.7}px, ${mouse.y * 0.7}px)`
        }}
      />

      <div
        className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full"
        style={{
          bottom: "8%",
          right: "12%",
          transform: `translate(${mouse.x * -0.6}px, ${mouse.y * -0.6}px)`
        }}
      />
    </div>
  );
}
