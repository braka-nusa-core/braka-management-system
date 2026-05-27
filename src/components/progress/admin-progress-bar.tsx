import { cn } from "@/lib/utils";

export function AdminProgressBar({ value }: { value: number }) {
    const clamped = Math.min(100, Math.max(0, value));
    const isComplete = clamped === 100;

    return (
        <div className="flex items-center gap-2.5 min-w-[120px]">
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isComplete ? "bg-emerald-400" : "bg-[#A3E635]"
                    )}
                    style={{ width: `${clamped}%` }}
                />
            </div>
            <span className={cn(
                "shrink-0 text-xs font-semibold tabular-nums w-9 text-right",
                isComplete ? "text-emerald-400" : "text-[#F4F4F5]"
            )}>
                {clamped}%
            </span>
        </div>
    );
}