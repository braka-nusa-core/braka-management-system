import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    animated?: boolean;
}

export function ProgressBar({ value, showLabel = true, size = "md", className, animated = true }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));
    const isComplete = clamped === 100;
    const heightClass = size === "lg" ? "h-2.5" : size === "sm" ? "h-1.5" : "h-2";

    return (
        <div className={className}>
            {showLabel && (
                <div className="mb-2.5 flex items-end justify-between">
                    <span className="text-sm text-white/50">Overall Progress</span>
                    <span className={cn("text-2xl font-black tabular-nums", isComplete ? "text-emerald-400" : "text-[#A3E635]")}>
                        {clamped}%
                    </span>
                </div>
            )}
            <div className={cn("w-full overflow-hidden rounded-full bg-white/[0.06]", heightClass)}>
                <div
                    className={cn(
                        "h-full rounded-full",
                        isComplete ? "bg-emerald-400" : "bg-gradient-to-r from-[#A3E635] to-[#84cc16]",
                        animated && "progress-fill"
                    )}
                    style={{ width: `${clamped}%`, animationDuration: "1s" }}
                />
            </div>
        </div>
    );
}