"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, Search, SlidersHorizontal, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { MAINTENANCE_CONTRACTS } from "@/constants/mock-data/maintenance";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MaintenanceStatus, BillingType } from "@/constants/mock-data/maintenance";

function formatRp(v: number) {
    return `Rp ${v.toLocaleString("id-ID")}`;
}
function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_FILTERS: { label: string; value: MaintenanceStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
];

const BILLING_FILTERS: { label: string; value: BillingType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
];

interface MaintenanceTableProps {
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function MaintenanceTable({ onAdd, onEdit, onDelete }: MaintenanceTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState<MaintenanceStatus | "all">("all");
    const [billingFilter, setBilling] = useState<BillingType | "all">("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const filtered = MAINTENANCE_CONTRACTS.filter((c) => {
        const matchSearch = [c.clientName, c.serviceName, c.id].some((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        );
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        const matchBilling = billingFilter === "all" || c.billingType === billingFilter;
        return matchSearch && matchStatus && matchBilling;
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-0 flex-1 sm:max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                        <Input
                            placeholder="Search contracts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 text-sm"
                        />
                    </div>

                    {/* Status filter pills */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setStatus(f.value)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${statusFilter === f.value
                                        ? "bg-[#A3E635] text-[#09090B]"
                                        : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Billing filter */}
                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                        {BILLING_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setBilling(f.value)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${billingFilter === f.value
                                        ? "bg-[#A3E635] text-[#09090B]"
                                        : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Button size="sm" className="shrink-0 gap-2" onClick={onAdd}>
                    <Plus size={14} /> Add Contract
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                {/* Desktop */}
                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Client", "Service Name", "Billing", "Price", "Next Due", "Status", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#A1A1AA]">
                                        No contracts found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((c) => (
                                <tr
                                    key={c.id}
                                    className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#F4F4F5]">{c.clientName}</p>
                                        <p className="font-mono text-[11px] text-[#A1A1AA]">{c.id}</p>
                                    </td>
                                    <td className="px-4 py-3 text-[#F4F4F5]">{c.serviceName}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-md bg-[#18181B] px-2 py-1 text-xs capitalize text-[#A1A1AA]">
                                            {c.billingType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#F4F4F5]">{formatRp(c.price)}</td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">{formatDate(c.nextDueDate)}</td>
                                    <td className="px-4 py-3">
                                        <MaintenanceStatusBadge status={c.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/maintenance/${c.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                                    <Eye size={14} />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => onEdit(c.id)}>
                                                <Pencil size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-400" title="Delete" onClick={() => onDelete(c.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-white/[0.06] lg:hidden">
                    {filtered.length === 0 && (
                        <p className="px-4 py-10 text-center text-sm text-[#A1A1AA]">No contracts found.</p>
                    )}
                    {filtered.map((c) => (
                        <div key={c.id} className="flex items-start justify-between px-4 py-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-[#F4F4F5]">{c.clientName}</p>
                                    <MaintenanceStatusBadge status={c.status} />
                                </div>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">{c.serviceName}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                                    <span className="capitalize">{c.billingType}</span>
                                    <span>·</span>
                                    <span className="font-semibold text-[#F4F4F5]">{formatRp(c.price)}</span>
                                    <span>·</span>
                                    <span>Due {formatDate(c.nextDueDate)}</span>
                                </div>
                            </div>
                            <div className="relative ml-3 shrink-0">
                                <button
                                    onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {openMenu === c.id && (
                                    <div className="absolute right-0 top-9 z-20 min-w-[140px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                        <Link href={`/maintenance/${c.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]" onClick={() => setOpenMenu(null)}>
                                            <Eye size={13} /> View
                                        </Link>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]" onClick={() => { onEdit(c.id); setOpenMenu(null); }}>
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]" onClick={() => { onDelete(c.id); setOpenMenu(null); }}>
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] px-4 py-3">
                    <p className="text-xs text-[#A1A1AA]">
                        Showing {filtered.length} of {MAINTENANCE_CONTRACTS.length} contracts
                    </p>
                </div>
            </div>
        </div>
    );
}