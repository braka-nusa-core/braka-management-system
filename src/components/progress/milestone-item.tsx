import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone, MilestoneStatus } from "@/constants/mock-data/project-progress";

const STATUS: Record<MilestoneStatus, { icon: React.ElementType; iconCls: string; line: string; label: string; labelCls: string }> = {
    completed: { icon: CheckCircle2, iconCls: "text-emerald-400", line: "bg-emerald-400/20", label: "Completed", labelCls: "text-emerald-400" },
    in_progress: { icon: Clock, iconCls: "text-[#A3E635]", line: "bg-[#A3E635]/20", label: "In Progress", labelCls: "text-[#A3E635]" },
    pending: { icon: Circle, iconCls: "text-white/20", line: "bg-white/[0.06]", label: "Pending", labelCls: "text-white/30" },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function MilestoneItem({ milestone, isLast }: { milestone: Milestone; isLast: boolean }) {
    const cfg = STATUS[milestone.status];
    const Icon = cfg.icon;
    const isPending = milestone.status === "pending";

    return (
        <li className="relative flex gap-5">
            {!isLast && (
                <span className={cn("absolute left-[17px] top-10 h-[calc(100%-8px)] w-0.5 rounded-full transition-colors", cfg.line)} />
            )}

            <div className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-all",
                isPending
                    ? "bg-[#09090B] ring-white/[0.06]"
                    : "bg-white/[0.04] ring-white/[0.08]"
            )}>
                <Icon size={17} className={cfg.iconCls} />
            </div>

            <div className={cn("min-w-0 flex-1 pb-8", isLast && "pb-0")}>
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                        <p className={cn("font-semibold leading-snug", isPending ? "text-white/30" : "text-white")}>
                            {milestone.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-white/40">{milestone.description}</p>
                    </div>
                    {milestone.date && (
                        <div className="shrink-0 text-right">
                            <p className={cn("text-xs font-semibold", cfg.labelCls)}>{cfg.label}</p>
                            <p className="mt-0.5 text-[11px] text-white/25">{formatDate(milestone.date)}</p>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}