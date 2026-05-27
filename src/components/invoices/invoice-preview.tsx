import { Building2, Mail, Calendar, FileText } from "lucide-react";
import { InvoiceItemsTable } from "./invoice-items-table";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import type { Invoice } from "@/types/invoice";

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

const COMPANY = {
    name: "PT Braka Solusi Teknik",
    tagline: "Professional Maintenance & Engineering Services",
};

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A3E635]/70">
                            Invoice
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-[#F4F4F5]">
                            {invoice.invoiceNumber}
                        </h2>
                        <div className="mt-3">
                            <InvoiceStatusBadge status={invoice.status} />
                        </div>
                    </div>

                    <div className="text-sm text-[#A1A1AA] sm:text-right">
                        <p className="font-semibold text-[#F4F4F5]">{COMPANY.name}</p>
                        <p>{COMPANY.tagline}</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                        { icon: Building2, label: "Client", value: invoice.clientName },
                        { icon: Mail, label: "Email", value: invoice.clientEmail },
                        { icon: Calendar, label: "Invoice Date", value: formatDate(invoice.invoiceDate) },
                        { icon: Calendar, label: "Due Date", value: formatDate(invoice.dueDate) },
                        {
                            icon: FileText,
                            label: "Maintenance",
                            value: invoice.maintenanceName ?? "No related maintenance",
                        },
                        {
                            icon: Calendar,
                            label: "Paid At",
                            value: invoice.paidAt ? formatDate(invoice.paidAt) : "Not paid yet",
                        },
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
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6">
                <h3 className="mb-4 text-[15px] font-semibold text-[#F4F4F5]">Line Items</h3>
                <InvoiceItemsTable items={invoice.items} />

                <div className="mt-6 ml-auto max-w-sm space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A1A1AA]">Subtotal</span>
                        <span className="font-medium text-[#F4F4F5]">
                            {formatRp(invoice.subtotal)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#A3E635]/10 px-4 py-3">
                        <span className="font-semibold text-[#F4F4F5]">Total</span>
                        <span className="font-bold text-[#A3E635]">
                            {formatRp(invoice.total)}
                        </span>
                    </div>
                </div>
            </div>

            {invoice.notes && (
                <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6">
                    <h3 className="mb-2 text-[15px] font-semibold text-[#F4F4F5]">Notes</h3>
                    <p className="text-sm leading-relaxed text-[#A1A1AA]">{invoice.notes}</p>
                </div>
            )}
        </div>
    );
}
