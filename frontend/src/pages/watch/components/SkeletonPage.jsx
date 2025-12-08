import Skeleton from "../../../components/common/Skeleton";

export default function SkeletonPage() {
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="w-full flex justify-center">
        <div className="max-w-[1600px] w-full px-6 py-6 flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <Skeleton variant="video" />
            <div className="h-8 w-full bg-[#181824] rounded-lg animate-pulse"></div>
            <div className="h-10 w-full bg-[#181824] rounded-full animate-pulse"></div>
            <div className="bg-[#111118] rounded-2xl p-6 border border-white/5 space-y-6">
              <div className="h-8 w-48 bg-[#181824] rounded mb-6 animate-pulse"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="comment" />
              ))}
            </div>
          </div>
          <div className="w-[360px] shrink-0">
            <div className="bg-[#111118] rounded-2xl p-4 border border-white/5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
