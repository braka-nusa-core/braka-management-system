import {
    Building2,
    Mail,
    Calendar,
    FileText,
    Wallet,
    Clock3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import type {
    ContractActivity,
    RelatedInvoice,
} from "@/constants/mock-data/maintenance";
import type { MaintenanceContract } from "@/types/maintenance";

function formatRp(v: number) {
    return `Rp ${v.toLocaleString("id-ID")}`;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function ContractInfoCard({ contract }: { contract: MaintenanceContract }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635]/10 text-xl font-bold text-[#A3E635]">
                        {contract.serviceName.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#F4F4F5]">
                            {contract.serviceName}
                        </h2>
                        <p className="font-mono text-xs text-[#A1A1AA]">{contract.id}</p>
                    </div>
                </div>
                <MaintenanceStatusBadge status={contract.status} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                    { icon: Building2, label: "Client", value: contract.clientName },
                    { icon: Mail, label: "Client Email", value: contract.clientEmail },
                    { icon: Calendar, label: "Start Date", value: formatDate(contract.startDate) },
                    { icon: Calendar, label: "Next Due Date", value: formatDate(contract.nextDueDate) },
                    { icon: Clock3, label: "Created At", value: formatDate(contract.createdAt) },
                    { icon: Clock3, label: "Updated At", value: formatDate(contract.updatedAt) },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 rounded-lg bg-[#18181B] px-4 py-3">
                        <Icon size={14} className="mt-0.5 shrink-0 text-[#A1A1AA]" />
                        <div>
                            <p className="text-[11px] text-[#A1A1AA]">{label}</p>
                            <p className="mt-0.5 text-sm text-[#F4F4F5]">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {contract.notes && (
                <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3">
                    <p className="text-[11px] text-[#A1A1AA]">Notes</p>
                    <p className="mt-1 text-sm text-[#F4F4F5]">{contract.notes}</p>
                </div>
            )}
        </div>
    );
}

export function BillingInfoCard({ contract }: { contract: MaintenanceContract }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">
                Billing Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {[
                    {
                        label: "Billing Type",
                        value: <span className="capitalize">{contract.billingType}</span>,
                    },
                    {
                        label: "Price",
                        value: (
                            <span className="font-bold text-[#A3E635]">
                                {formatRp(contract.price)}
                            </span>
                        ),
                    },
                    { label: "Status", value: <span className="capitalize">{contract.status}</span> },
                    { label: "Next Invoice", value: formatDate(contract.nextDueDate) },
                ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-[#18181B] px-4 py-3">
                        <p className="text-[11px] text-[#A1A1AA]">{label}</p>
                        <div className="mt-1 text-sm text-[#F4F4F5]">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ApiScopeNoteCard() {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-3 text-[15px] font-semibold text-[#F4F4F5]">
                API Coverage
            </h3>
            <div className="rounded-lg bg-[#18181B] px-4 py-4">
                <p className="text-sm text-[#F4F4F5]">
                    This maintenance detail view is now driven by the API contract.
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1AA]">
                    The backend currently provides core contract fields like client,
                    service name, billing, dates, status, and notes. Extra UI metadata
                    from the previous mock version is hidden until matching endpoints
                    are available.
                </p>
            </div>
        </div>
    );
}

const INV_STATUS: Record<RelatedInvoice["status"], string> = {
    paid: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    overdue: "bg-red-500/10 text-red-400",
};

export function RelatedInvoicesCard({ invoices }: { invoices: RelatedInvoice[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">
                Related Invoices
            </h3>
            {invoices.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">
                    No invoices yet.
                </p>
            ) : (
                <div className="space-y-2">
                    {invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between rounded-lg bg-[#18181B] px-4 py-3"
                        >
                            <div>
                                <p className="font-mono text-sm font-medium text-[#F4F4F5]">
                                    {invoice.id}
                                </p>
                                <p className="mt-0.5 text-xs text-[#A1A1AA]">
                                    {formatDate(invoice.date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-[#F4F4F5]">
                                    {formatRp(invoice.amount)}
                                </p>
                                <span
                                    className={cn(
                                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                                        INV_STATUS[invoice.status]
                                    )}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const ACTIVITY_ICON: Record<ContractActivity["type"], { icon: React.ElementType; cls: string }> = {
    created: { icon: FileText, cls: "text-[#A3E635]" },
    renewed: { icon: Wallet, cls: "text-sky-400" },
    paused: { icon: Clock3, cls: "text-amber-400" },
    invoice_sent: { icon: FileText, cls: "text-[#A1A1AA]" },
    payment_received: { icon: Wallet, cls: "text-emerald-400" },
};

export function ContractActivityCard({ activities }: { activities: ContractActivity[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-5 text-[15px] font-semibold text-[#F4F4F5]">
                Recent Activity
            </h3>
            {activities.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">
                    No activity yet.
                </p>
            ) : (
                <ol className="space-y-0">
                    {activities.map((item, index) => {
                        const { icon: Icon, cls } = ACTIVITY_ICON[item.type];
                        const isLast = index === activities.length - 1;

                        return (
                            <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
                                {!isLast && (
                                    <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-white/[0.06]" />
                                )}
                                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18181B] ring-1 ring-white/[0.06]">
                                    <Icon size={14} className={cls} />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-sm text-[#F4F4F5]">{item.description}</p>
                                    <p className="mt-1 text-[11px] text-[#A1A1AA]/60">
                                        {item.timestamp}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}
