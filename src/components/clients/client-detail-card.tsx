import { MapPin, Mail, Phone, User, Calendar, FileText } from "lucide-react";
import { ClientStatusBadge } from "./client-status-badge";
import type { Client, MaintenanceContract, InvoiceHistory, ProjectProgress } from "@/constants/mock-data/clients";
import { cn } from "@/lib/utils";

function formatRp(amount: number) {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ── Info Card ─────────────────────────────────────────────────────────────────

export function ClientInfoCard({ client }: { client: Client }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635]/10 text-lg font-bold text-[#A3E635]">
                        {client.companyName.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#F4F4F5]">{client.companyName}</h2>
                        <p className="font-mono text-xs text-[#A1A1AA]">{client.id}</p>
                    </div>
                </div>
                <ClientStatusBadge status={client.status} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                    { icon: User, label: "PIC Name", value: client.picName },
                    { icon: Mail, label: "Email", value: client.email },
                    { icon: Phone, label: "Phone", value: client.phone },
                    { icon: MapPin, label: "Address", value: client.address },
                    { icon: Calendar, label: "Joined", value: formatDate(client.joinedAt) },
                    { icon: FileText, label: "Total Projects", value: String(client.totalProjects) },
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

            {client.notes && (
                <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3">
                    <p className="text-[11px] text-[#A1A1AA]">Notes</p>
                    <p className="mt-1 text-sm text-[#F4F4F5]">{client.notes}</p>
                </div>
            )}
        </div>
    );
}

// ── Maintenance Contracts ─────────────────────────────────────────────────────

const CONTRACT_STATUS: Record<MaintenanceContract["status"], string> = {
    active: "bg-emerald-500/10 text-emerald-400",
    expired: "bg-[#18181B] text-[#A1A1AA]",
    pending: "bg-amber-500/10 text-amber-400",
};

export function MaintenanceContractsCard({ contracts }: { contracts: MaintenanceContract[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Maintenance Contracts</h3>
            {contracts.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">No contracts found.</p>
            ) : (
                <div className="space-y-2">
                    {contracts.map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#18181B] px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-[#F4F4F5]">{c.title}</p>
                                <p className="mt-0.5 font-mono text-xs text-[#A1A1AA]">
                                    {c.id} · {formatDate(c.startDate)} – {formatDate(c.endDate)}
                                </p>
                            </div>
                            <div className="text-right ml-4 shrink-0">
                                <p className="text-sm font-semibold text-[#F4F4F5]">{formatRp(c.value)}</p>
                                <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", CONTRACT_STATUS[c.status])}>
                                    {c.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Invoice History ───────────────────────────────────────────────────────────

const INV_STATUS: Record<InvoiceHistory["status"], string> = {
    paid: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    overdue: "bg-red-500/10 text-red-400",
};

export function InvoiceHistoryCard({ invoices }: { invoices: InvoiceHistory[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Invoice History</h3>
            {invoices.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">No invoices found.</p>
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

// ── Project Progress ──────────────────────────────────────────────────────────

const PROJ_STATUS: Record<ProjectProgress["status"], { label: string; bar: string; text: string }> = {
    on_track: { label: "On Track", bar: "bg-emerald-500", text: "text-emerald-400" },
    delayed: { label: "Delayed", bar: "bg-red-500", text: "text-red-400" },
    completed: { label: "Completed", bar: "bg-[#A3E635]", text: "text-[#A3E635]" },
};

export function ProjectProgressCard({ projects }: { projects: ProjectProgress[] }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
            <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Project Progress</h3>
            {projects.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#A1A1AA]">No projects found.</p>
            ) : (
                <div className="space-y-4">
                    {projects.map((p) => {
                        const cfg = PROJ_STATUS[p.status];
                        return (
                            <div key={p.id}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#F4F4F5]">{p.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-xs font-medium", cfg.text)}>{cfg.label}</span>
                                        <span className="text-xs text-[#A1A1AA]">{p.progress}%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#18181B]">
                                    <div
                                        className={cn("h-full rounded-full transition-all", cfg.bar)}
                                        style={{ width: `${p.progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}