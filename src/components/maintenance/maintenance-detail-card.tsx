import {
    User, Mail, Phone, MapPin, Calendar, RefreshCw,
    Bell, CheckCircle2, RotateCcw, PauseCircle, Send, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import type {
    MaintenanceContract,
    RelatedInvoice,
    ContractActivity,
} from "@/constants/mock-data/maintenance";

function formatRp(v: number) { return `Rp ${v.toLocaleString("id-ID")}`; }
function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// ── Contract Info ─────────────────────────────────────────────────────────────

export function ContractInfoCard({ contract }: { contract: MaintenanceContract }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635]/10 text-xl font-bold text-[#A3E635]">
                        {contract.serviceName.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#F4F4F5]">{contract.serviceName}</h2>
                        <p className="font-mono text-xs text-[#A1A1AA]">{contract.id}</p>
                    </div>
                </div>
                <MaintenanceStatusBadge status={contract.status} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                    { icon: User, label: "Client", value: contract.clientName },
                    { icon: User, label: "Contact PIC", value: contract.contactPerson },
                    { icon: Phone, label: "Phone", value: contract.contactPhone },
                    { icon: Mail, label: "Address", value: contract.address },
                    { icon: Calendar, label: "Start Date", value: formatDate(contract.startDate) },
                    { icon: Calendar, label: "Next Due Date", value: formatDate(contract.nextDueDate) },
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

// ── Billing Info ──────────────────────────────────────────────────────────────

export function BillingInfoCard({ contract }: { contract: MaintenanceContract }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Billing Information</h3>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: "Billing Type", value: <span className="capitalize">{contract.billingType}</span> },
                    { label: "Price", value: <span className="font-bold text-[#A3E635]">{formatRp(contract.price)}</span> },
                    {
                        label: "Auto Renew", value: contract.autoRenew
                            ? <span className="text-emerald-400">Enabled</span>
                            : <span className="text-[#A1A1AA]">Disabled</span>
                    },
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

// ── Reminder Info ─────────────────────────────────────────────────────────────

export function ReminderInfoCard({ contract }: { contract: MaintenanceContract }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Reminder Settings</h3>
            <div className="flex items-center gap-4 rounded-lg bg-[#18181B] px-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <Bell size={16} className="text-amber-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-[#F4F4F5]">
                        Remind {contract.reminderDaysBefore} days before due date
                    </p>
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">
                        Reminder will trigger on {formatDate(
                            new Date(new Date(contract.nextDueDate).setDate(
                                new Date(contract.nextDueDate).getDate() - contract.reminderDaysBefore
                            )).toISOString()
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Related Invoices ──────────────────────────────────────────────────────────

const INV_STATUS: Record<RelatedInvoice["status"], string> = {
    paid: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    overdue: "bg-red-500/10 text-red-400",
};

export function RelatedInvoicesCard({ invoices }: { invoices: RelatedInvoice[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Related Invoices</h3>
            {invoices.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">No invoices yet.</p>
            ) : (
                <div className="space-y-2">
                    {invoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between rounded-lg bg-[#18181B] px-4 py-3">
                            <div>
                                <p className="font-mono text-sm font-medium text-[#F4F4F5]">{inv.id}</p>
                                <p className="mt-0.5 text-xs text-[#A1A1AA]">{formatDate(inv.date)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-[#F4F4F5]">{formatRp(inv.amount)}</p>
                                <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", INV_STATUS[inv.status])}>
                                    {inv.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Recent Activity ───────────────────────────────────────────────────────────

const ACTIVITY_ICON: Record<ContractActivity["type"], { icon: React.ElementType; cls: string }> = {
    created: { icon: CheckCircle2, cls: "text-[#A3E635]" },
    renewed: { icon: RotateCcw, cls: "text-sky-400" },
    paused: { icon: PauseCircle, cls: "text-amber-400" },
    invoice_sent: { icon: Send, cls: "text-[#A1A1AA]" },
    payment_received: { icon: CreditCard, cls: "text-emerald-400" },
};

export function ContractActivityCard({ activities }: { activities: ContractActivity[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-5 text-[15px] font-semibold text-[#F4F4F5]">Recent Activity</h3>
            {activities.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">No activity yet.</p>
            ) : (
                <ol className="space-y-0">
                    {activities.map((item, i) => {
                        const { icon: Icon, cls } = ACTIVITY_ICON[item.type];
                        const isLast = i === activities.length - 1;
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
                                    <p className="mt-1 text-[11px] text-[#A1A1AA]/60">{item.timestamp}</p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}