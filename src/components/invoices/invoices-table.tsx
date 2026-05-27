"use client";

import { useState } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    FileDown,
    Search,
    Plus,
    MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

function formatRp(v: number) {
    return `Rp ${v.toLocaleString("id-ID")}`;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_TABS: { label: string; value: InvoiceStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Sent", value: "sent" },
    { label: "Paid", value: "paid" },
    { label: "Overdue", value: "overdue" },
    { label: "Cancelled", value: "cancelled" },
];

interface InvoicesTableProps {
    invoices: Invoice[];
    totalInvoices: number;
    isLoading?: boolean;
    errorMessage?: string | null;
    onCreate: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onMarkPaid: (id: string) => void;
}

export function InvoicesTable({
    invoices,
    totalInvoices,
    isLoading = false,
    errorMessage,
    onCreate,
    onEdit,
    onDelete,
    onMarkPaid,
}: InvoicesTableProps) {
    const [search, setSearch] = useState("");
    const [statusTab, setStatusTab] = useState<InvoiceStatus | "all">("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const filtered = invoices.filter((invoice) => {
        const matchStatus = statusTab === "all" || invoice.status === statusTab;
        const matchSearch = [invoice.invoiceNumber, invoice.clientName].some((field) =>
            field.toLowerCase().includes(search.toLowerCase())
        );
        return matchStatus && matchSearch;
    });

    if (isLoading) {
        return (
            <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-10 text-center">
                <p className="text-sm font-semibold text-[#F4F4F5]">Loading invoices...</p>
                <p className="mt-1 text-sm text-[#A1A1AA]">
                    Fetching the latest invoice data from the API.
                </p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-sm font-semibold text-red-300">Failed to load invoices</p>
                <p className="mt-1 text-sm text-red-200/80">{errorMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                    />
                    <Input
                        placeholder="Search invoices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 text-sm"
                    />
                </div>
                <Button size="sm" className="shrink-0 gap-2" onClick={onCreate}>
                    <Plus size={14} /> Create Invoice
                </Button>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusTab(tab.value)}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            statusTab === tab.value
                                ? "bg-[#A3E635] text-[#09090B]"
                                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {[
                                    "Invoice #",
                                    "Client",
                                    "Amount",
                                    "Due Date",
                                    "Status",
                                    "Created",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-[#A1A1AA]"
                                    >
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-mono font-semibold text-[#F4F4F5]">
                                            {invoice.invoiceNumber}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#F4F4F5]">
                                            {invoice.clientName}
                                        </p>
                                        <p className="text-xs text-[#A1A1AA]">
                                            {invoice.clientEmail}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#F4F4F5]">
                                        {formatRp(invoice.total)}
                                    </td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">
                                        {formatDate(invoice.dueDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">
                                        {formatDate(invoice.invoiceDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/invoices/${invoice.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                                    <Eye size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Edit"
                                                onClick={() => onEdit(invoice.id)}
                                            >
                                                <Pencil size={14} />
                                            </Button>
                                            {invoice.status !== "paid" &&
                                                invoice.status !== "cancelled" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 hover:text-emerald-400"
                                                        title="Mark as Paid"
                                                        onClick={() => onMarkPaid(invoice.id)}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </Button>
                                                )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:text-sky-400"
                                                title="Export PDF"
                                            >
                                                <FileDown size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:text-red-400"
                                                title="Delete"
                                                onClick={() => onDelete(invoice.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="divide-y divide-white/[0.06] md:hidden">
                    {filtered.length === 0 && (
                        <p className="px-4 py-10 text-center text-sm text-[#A1A1AA]">
                            No invoices found.
                        </p>
                    )}
                    {filtered.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-start justify-between px-4 py-4"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-sm font-semibold text-[#F4F4F5]">
                                        {invoice.invoiceNumber}
                                    </span>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </div>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">
                                    {invoice.clientName}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-[#A1A1AA]">
                                    <span className="font-semibold text-[#F4F4F5]">
                                        {formatRp(invoice.total)}
                                    </span>
                                    <span>· Due {formatDate(invoice.dueDate)}</span>
                                </div>
                            </div>
                            <div className="relative ml-3 shrink-0">
                                <button
                                    onClick={() =>
                                        setOpenMenu(openMenu === invoice.id ? null : invoice.id)
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {openMenu === invoice.id && (
                                    <div className="absolute right-0 top-9 z-20 min-w-[160px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                        <Link
                                            href={`/invoices/${invoice.id}`}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            <Eye size={13} /> View
                                        </Link>
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => {
                                                onEdit(invoice.id);
                                                setOpenMenu(null);
                                            }}
                                        >
                                            <Pencil size={13} /> Edit
                                        </button>
                                        {invoice.status !== "paid" && (
                                            <button
                                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-white/[0.05]"
                                                onClick={() => {
                                                    onMarkPaid(invoice.id);
                                                    setOpenMenu(null);
                                                }}
                                            >
                                                <CheckCircle2 size={13} /> Mark as Paid
                                            </button>
                                        )}
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-sky-400 hover:bg-white/[0.05]">
                                            <FileDown size={13} /> Export PDF
                                        </button>
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]"
                                            onClick={() => {
                                                onDelete(invoice.id);
                                                setOpenMenu(null);
                                            }}
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/[0.06] px-4 py-3">
                    <p className="text-xs text-[#A1A1AA]">
                        Showing {filtered.length} of {totalInvoices} invoices
                    </p>
                </div>
            </div>
        </div>
    );
}
