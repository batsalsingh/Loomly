import Skeleton from '../Skeleton';

const ProfileSkeleton = () => (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
            <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="flex p-4 border-b border-gray-800 space-x-2">
                    <Skeleton className="h-8 w-28 rounded-md" />
                    <Skeleton className="h-8 w-32 rounded-md" />
                    <Skeleton className="h-8 w-40 rounded-md" />
                </div>
                <div className="p-6">
                    <Skeleton className="h-8 w-1/3 mb-6" />
                    <div className="space-y-6 max-w-lg">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-10 w-32 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProfileSkeleton;