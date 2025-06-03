import { Skeleton } from '../ui/skeleton';

export default function SkeletonBar() {
    return (
        <div className="space-y-2 mb-2">
            <Skeleton className="h-4 w-full bg-[#F2F2F2] dark:bg-accent" />
            <Skeleton className="h-4 w-full bg-[#F2F2F2] dark:bg-accent" />
        </div>
    );
}
