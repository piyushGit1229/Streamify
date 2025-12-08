export default function DescriptionBox({ video }) {
  if (!video.description) return null;

  return (
    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-[15px]">
      {video.description}
      {/* Read More/Less toggle logic would be implemented here */}
    </p>
  );
}
