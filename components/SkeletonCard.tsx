export default function SkeletonCard() {
  return (
    <div className="border rounded-lg shadow-md p-4 animate-pulse">
      <div className="bg-gray-300 rounded-md w-full h-48 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
      <div className="h-10 bg-gray-300 rounded" />
    </div>
  );
}
