import { cn } from "@/lib/utils";
import type { ClientStatus } from "@/constants/mock-data/clients";

const CONFIG: Record<ClientStatus, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-emerald-500/10 text-emerald-400" },
    inactive: { label: "Inactive", className: "bg-[#18181B] text-[#A1A1AA]" },
    prospect: { label: "Prospect", className: "bg-[#A3E635]/10 text-[#A3E635]" },
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const { label, className } = CONFIG[status];
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", className)}>
            <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
                "bg-emerald-400": status === "active",
                "bg-[#A1A1AA]": status === "inactive",
                "bg-[#A3E635]": status === "prospect",
            })} />
            {label}
        </span>
    );
}