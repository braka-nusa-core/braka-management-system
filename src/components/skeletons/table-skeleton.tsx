import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
    return <div className={cn("rounded-md shimmer", className)} />;
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                <Shimmer className="h-8 w-48 rounded-md" />
                <Shimmer className="h-8 w-20 rounded-md" />
                <div className="ml-auto"><Shimmer className="h-8 w-28 rounded-md" /></div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {Array.from({ length: cols }).map((_, i) => (
                                <th key={i} className="px-4 py-3"><Shimmer className="h-3 w-16 rounded" /></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, r) => (
                            <tr key={r} className="border-b border-white/[0.04] last:border-0">
                                {Array.from({ length: cols }).map((_, c) => (
                                    <td key={c} className="px-4 py-3.5">
                                        <Shimmer className={cn("h-4 rounded", c === 0 ? "w-36" : c === cols - 1 ? "w-16" : c % 2 === 0 ? "w-24" : "w-20")} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="border-t border-white/[0.06] px-4 py-3">
                <Shimmer className="h-3 w-32 rounded" />
            </div>
        </div>
    );
}