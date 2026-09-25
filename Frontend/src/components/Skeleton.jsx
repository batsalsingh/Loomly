const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-md ${className} animate-shimmer`}></div>
);

export default Skeleton;