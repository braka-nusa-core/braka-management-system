import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/progress";

const CONFIG: Record<ProjectStatus, { label: string; className: string; dot: string; pulse?: boolean }> = {
    planning: { label: "Planning", dot: "bg-[#A1A1AA]", className: "bg-[#18181B] text-[#A1A1AA] border border-[#A1A1AA]/20" },
    design: { label: "Design", dot: "bg-violet-400", className: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
    development: { label: "Development", dot: "bg-sky-400", className: "bg-sky-500/10 text-sky-400 border border-sky-500/20", pulse: true },
    revision: { label: "Revision", dot: "bg-amber-400", className: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
    testing: { label: "Testing", dot: "bg-orange-400", className: "bg-orange-500/10 text-orange-400 border border-orange-500/20", pulse: true },
    completed: { label: "Completed", dot: "bg-emerald-400", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
};

export function ProgressStatusBadge({
    status,
    size = "md",
}: {
    status: ProjectStatus;
    size?: "sm" | "md" | "lg";
}) {
    const cfg = CONFIG[status];
    const sizeClass =
        size === "lg" ? "px-3.5 py-1.5 text-sm" :
            size === "sm" ? "px-2 py-0.5 text-[10px]" :
                "px-2.5 py-1 text-xs";

    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full font-medium", sizeClass, cfg.className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot, cfg.pulse && "animate-pulse")} />
            {cfg.label}
        </span>
    );
}
