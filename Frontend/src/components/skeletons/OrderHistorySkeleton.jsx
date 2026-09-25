import Skeleton from '../Skeleton';

const OrderHistorySkeleton = () => (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
        <div className="container mx-auto">
            <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
            <div className="space-y-6 max-w-4xl mx-auto">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                            <div>
                                <Skeleton className="h-6 w-64 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div className="text-right">
                           <Skeleton className="h-7 w-32 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default OrderHistorySkeleton;