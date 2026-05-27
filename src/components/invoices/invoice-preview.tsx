import { Building2, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { InvoiceItemsTable } from "./invoice-items-table";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import type { Invoice } from "@/constants/mock-data/invoices";

function formatRp(v: number) { return `Rp ${v.toLocaleString("id-ID")}`; }
function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const COMPANY = {
    name: "PT Braka Solusi Teknik",
    tagline: "Professional Maintenance & Engineering Services",
    address: "Jl. Kebayoran Baru No. 88, Jakarta Selatan 12110",
    phone: "021-5555-1234",
    email: "invoice@braka.co.id",
    npwp: "12.345.678.9-012.000",
};

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
    const isPaid = invoice.status === "paid";

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] shadow-2xl shadow-black/30">

            {/* Paid watermark */}
            {isPaid && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
                    <span className="rotate-[-28deg] text-[88px] font-black uppercase tracking-[0.2em] text-emerald-500/[0.05]">
                        PAID
                    </span>
                </div>
            )}

            {/* Top lime accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#A3E635] via-[#84cc16] to-transparent" />

            <div className="p-8 md:p-12">
                {/* ── Header ─────────────────────────────────── */}
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    {/* Company */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                                <span className="text-lg font-black text-[#09090B]">B</span>
                            </div>
                            <div>
                                <p className="text-base font-bold text-[#F4F4F5]">{COMPANY.name}</p>
                                <p className="text-[11px] text-[#A1A1AA]">{COMPANY.tagline}</p>
                            </div>
                        </div>
                        <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                            <p className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0 text-[#A1A1AA]/50" />{COMPANY.address}</p>
                            <p className="flex items-center gap-1.5"><Phone size={11} className="shrink-0 text-[#A1A1AA]/50" />{COMPANY.phone}</p>
                            <p className="flex items-center gap-1.5"><Mail size={11} className="shrink-0 text-[#A1A1AA]/50" />{COMPANY.email}</p>
                            <p className="text-[10px] text-[#A1A1AA]/40">NPWP: {COMPANY.npwp}</p>
                        </div>
                    </div>

                    {/* Invoice meta */}
                    <div className="sm:text-right">
                        <InvoiceStatusBadge status={invoice.status} />
                        <p className="mt-2 text-4xl font-black tracking-tight text-[#A3E635]">INVOICE</p>
                        <p className="mt-1 font-mono text-xl font-bold text-[#F4F4F5]">{invoice.invoiceNumber}</p>
                        <div className="mt-3 space-y-1 text-xs text-[#A1A1AA]">
                            <div className="flex items-center gap-2 sm:justify-end">
                                <span className="text-[#A1A1AA]/50">Issued</span>
                                <span className="font-medium text-[#F4F4F5]">{formatDate(invoice.invoiceDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:justify-end">
                                <span className="text-[#A1A1AA]/50">Due</span>
                                <span className={invoice.status === "overdue" ? "font-semibold text-red-400" : "font-medium text-[#F4F4F5]"}>
                                    {formatDate(invoice.dueDate)}
                                </span>
                            </div>
                            {invoice.paidDate && (
                                <div className="flex items-center gap-1 text-emerald-400 sm:justify-end">
                                    <CheckCircle2 size={11} />
                                    <span>Paid {formatDate(invoice.paidDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-[#A3E635]/20 via-white/[0.04] to-transparent" />

                {/* ── Bill To / Reference ─────────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">Bill To</p>
                        <div className="rounded-xl border border-white/[0.06] bg-[#18181B] p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-[#A3E635] shrink-0" />
                                <p className="font-bold text-[#F4F4F5]">{invoice.clientName}</p>
                            </div>
                            <div className="space-y-1 text-xs text-[#A1A1AA]">
                                <p>Attn: {invoice.clientPic}</p>
                                <p className="flex items-center gap-1.5"><Phone size={10} />{invoice.clientPhone}</p>
                                <p className="flex items-center gap-1.5"><Mail size={10} />{invoice.clientEmail}</p>
                                <p className="flex items-start gap-1.5"><MapPin size={10} className="mt-0.5 shrink-0" />{invoice.clientAddress}</p>
                            </div>
                        </div>
                    </div>

                    {invoice.relatedMaintenance && (
                        <div>
                            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">Reference</p>
                            <div className="rounded-xl border border-white/[0.06] bg-[#18181B] p-4">
                                <p className="text-xs text-[#A1A1AA]">Maintenance Contract</p>
                                <p className="mt-1.5 font-mono text-base font-bold text-[#A3E635]">{invoice.relatedMaintenance}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Items ───────────────────────────────────── */}
                <div className="mt-8">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">Services & Items</p>
                    <InvoiceItemsTable items={invoice.items} />
                </div>

                {/* ── Totals ──────────────────────────────────── */}
                <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-[280px] space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#A1A1AA]">Subtotal</span>
                            <span className="font-medium text-[#F4F4F5]">{formatRp(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#A1A1AA]">PPN {invoice.taxRate}%</span>
                            <span className="font-medium text-[#F4F4F5]">{formatRp(invoice.tax)}</span>
                        </div>
                        <div className="my-2 h-px bg-white/[0.08]" />
                        <div className="flex justify-between rounded-xl bg-[#A3E635]/10 px-4 py-3 ring-1 ring-[#A3E635]/20">
                            <span className="font-bold text-[#F4F4F5]">Total</span>
                            <span className="font-bold text-[#A3E635]">{formatRp(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Payment ─────────────────────────────────── */}
                <div className="mt-8 rounded-xl border border-white/[0.06] bg-[#18181B] p-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">Payment Information</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            { label: "Bank", value: invoice.paymentInfo.bankName },
                            { label: "Account Number", value: invoice.paymentInfo.accountNumber },
                            { label: "Account Name", value: invoice.paymentInfo.accountName },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[11px] text-[#A1A1AA]/60">{label}</p>
                                <p className="mt-0.5 text-sm font-semibold text-[#F4F4F5]">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Notes ───────────────────────────────────── */}
                {invoice.notes && (
                    <div className="mt-6 rounded-xl border border-white/[0.04] bg-white/[0.01] px-5 py-4">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#A1A1AA]/40">Notes</p>
                        <p className="text-sm leading-relaxed text-[#A1A1AA]">{invoice.notes}</p>
                    </div>
                )}

                {/* ── Footer ──────────────────────────────────── */}
                <div className="mt-10 border-t border-white/[0.05] pt-6 text-center">
                    <p className="text-[11px] text-[#A1A1AA]/30">
                        Thank you for your business · {COMPANY.name} · {COMPANY.email}
                    </p>
                </div>
            </div>
        </div>
    );
}