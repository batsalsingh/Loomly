import Skeleton from './Skeleton';

const ProductCardSkeleton = () => (
  <div className="block">
    <div className="relative overflow-hidden border border-gray-800 rounded-md">
      <Skeleton className="w-full h-96" />
      <div className="absolute bottom-0 left-0 p-4 w-full">
         <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/4" />
         </div>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;