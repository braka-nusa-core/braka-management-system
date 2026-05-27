import { cn } from "@/lib/utils";
import type { MaintenanceStatus } from "@/constants/mock-data/maintenance";

const CONFIG: Record<MaintenanceStatus, { label: string; dot: string; className: string }> = {
    active: { label: "Active", dot: "bg-emerald-400", className: "bg-emerald-500/10 text-emerald-400" },
    paused: { label: "Paused", dot: "bg-amber-400", className: "bg-amber-500/10 text-amber-400" },
    expired: { label: "Expired", dot: "bg-[#A1A1AA]", className: "bg-[#18181B] text-[#A1A1AA]" },
    cancelled: { label: "Cancelled", dot: "bg-red-400", className: "bg-red-500/10 text-red-400" },
};

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
    const { label, dot, className } = CONFIG[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
            {label}
        </span>
    );
}