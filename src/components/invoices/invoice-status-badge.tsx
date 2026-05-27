import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/constants/mock-data/invoices";

const CONFIG: Record<InvoiceStatus, { label: string; dot: string; className: string }> = {
    draft: { label: "Draft", dot: "bg-[#A1A1AA]", className: "bg-[#18181B] text-[#A1A1AA]" },
    sent: { label: "Sent", dot: "bg-sky-400", className: "bg-sky-500/10 text-sky-400" },
    paid: { label: "Paid", dot: "bg-emerald-400", className: "bg-emerald-500/10 text-emerald-400" },
    overdue: { label: "Overdue", dot: "bg-red-400", className: "bg-red-500/10 text-red-400" },
    cancelled: { label: "Cancelled", dot: "bg-[#A1A1AA]", className: "bg-[#18181B] text-[#A1A1AA]" },
};

// handle legacy "pending" from dashboard mock
const ALIAS: Record<string, InvoiceStatus> = { pending: "sent" };

export function InvoiceStatusBadge({ status }: { status: string }) {
    const resolved = (ALIAS[status] ?? status) as InvoiceStatus;
    const cfg = CONFIG[resolved] ?? CONFIG.draft;
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", cfg.className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
        </span>
    );
}