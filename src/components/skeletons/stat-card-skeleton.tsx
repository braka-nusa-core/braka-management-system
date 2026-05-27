import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
    return <div className={cn("rounded-md shimmer", className)} />;
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <div className="flex items-start justify-between">
                <Shimmer className="h-9 w-9 rounded-lg" />
                <Shimmer className="h-5 w-14 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <Shimmer className="h-7 w-20" />
                <Shimmer className="h-4 w-28" />
            </div>
            <Shimmer className="mt-3 h-3 w-32" />
        </div>
    );
}

export function StatCardSkeletonGrid({ count = 5 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: count }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}