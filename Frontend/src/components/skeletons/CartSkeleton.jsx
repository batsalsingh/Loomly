import Skeleton from '../Skeleton';

const CartSkeleton = () => (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
        <div className="container mx-auto">
            <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                            <Skeleton className="w-24 h-32 rounded-md" />
                            <div className="ml-4 flex-grow">
                                <Skeleton className="h-6 w-3/4 mb-3" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-6 w-16 mb-3" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-lg border border-gray-800 h-fit">
                    <Skeleton className="h-8 w-3/4 mb-6" />
                    <div className="space-y-4">
                        <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                        <div className="flex justify-between"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-5 w-1/4" /></div>
                        <Skeleton className="h-px w-full my-4" />
                        <div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/3" /></div>
                    </div>
                    <Skeleton className="w-full mt-6 h-12 rounded-md" />
                </div>
            </div>
        </div>
    </div>
);

export default CartSkeleton;