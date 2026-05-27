"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, Search, Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BillingType, MaintenanceContract, MaintenanceStatus } from "@/types/maintenance";

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
    contracts: MaintenanceContract[];
    totalContracts: number;
    isLoading?: boolean;
    errorMessage?: string | null;
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function MaintenanceTable({
    contracts,
    totalContracts,
    isLoading = false,
    errorMessage,
    onAdd,
    onEdit,
    onDelete,
}: MaintenanceTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState<MaintenanceStatus | "all">("all");
    const [billingFilter, setBilling] = useState<BillingType | "all">("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const filtered = contracts.filter((contract) => {
        const matchSearch = [
            contract.clientName,
            contract.clientEmail,
            contract.serviceName,
            contract.id,
        ].some((field) => field.toLowerCase().includes(search.toLowerCase()));
        const matchStatus =
            statusFilter === "all" || contract.status === statusFilter;
        const matchBilling =
            billingFilter === "all" || contract.billingType === billingFilter;

        return matchSearch && matchStatus && matchBilling;
    });

    if (isLoading) {
        return (
            <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-10 text-center">
                <p className="text-sm font-semibold text-[#F4F4F5]">
                    Loading maintenance contracts...
                </p>
                <p className="mt-1 text-sm text-[#A1A1AA]">
                    Fetching the latest contract data from the API.
                </p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-sm font-semibold text-red-300">
                    Failed to load maintenance contracts
                </p>
                <p className="mt-1 text-sm text-red-200/80">{errorMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <div className="relative min-w-0 flex-1 sm:max-w-xs">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                        />
                        <Input
                            placeholder="Search contracts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                        {STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setStatus(filter.value)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                    statusFilter === filter.value
                                        ? "bg-[#A3E635] text-[#09090B]"
                                        : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                        {BILLING_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setBilling(filter.value)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                    billingFilter === filter.value
                                        ? "bg-[#A3E635] text-[#09090B]"
                                        : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Button size="sm" className="shrink-0 gap-2" onClick={onAdd}>
                    <Plus size={14} /> Add Contract
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {[
                                    "Client",
                                    "Service Name",
                                    "Billing",
                                    "Price",
                                    "Next Due",
                                    "Status",
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
                                        No contracts found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((contract) => (
                                <tr
                                    key={contract.id}
                                    className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#F4F4F5]">
                                            {contract.clientName}
                                        </p>
                                        <p className="font-mono text-[11px] text-[#A1A1AA]">
                                            {contract.id}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-[#F4F4F5]">
                                        {contract.serviceName}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-md bg-[#18181B] px-2 py-1 text-xs capitalize text-[#A1A1AA]">
                                            {contract.billingType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#F4F4F5]">
                                        {formatRp(contract.price)}
                                    </td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">
                                        {formatDate(contract.nextDueDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <MaintenanceStatusBadge status={contract.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/maintenance/${contract.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                                    <Eye size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                title="Edit"
                                                onClick={() => onEdit(contract.id)}
                                            >
                                                <Pencil size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:text-red-400"
                                                title="Delete"
                                                onClick={() => onDelete(contract.id)}
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

                <div className="divide-y divide-white/[0.06] lg:hidden">
                    {filtered.length === 0 && (
                        <p className="px-4 py-10 text-center text-sm text-[#A1A1AA]">
                            No contracts found.
                        </p>
                    )}
                    {filtered.map((contract) => (
                        <div
                            key={contract.id}
                            className="flex items-start justify-between px-4 py-4"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-[#F4F4F5]">
                                        {contract.clientName}
                                    </p>
                                    <MaintenanceStatusBadge status={contract.status} />
                                </div>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">
                                    {contract.serviceName}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                                    <span className="capitalize">{contract.billingType}</span>
                                    <span>·</span>
                                    <span className="font-semibold text-[#F4F4F5]">
                                        {formatRp(contract.price)}
                                    </span>
                                    <span>·</span>
                                    <span>Due {formatDate(contract.nextDueDate)}</span>
                                </div>
                            </div>
                            <div className="relative ml-3 shrink-0">
                                <button
                                    onClick={() =>
                                        setOpenMenu(openMenu === contract.id ? null : contract.id)
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {openMenu === contract.id && (
                                    <div className="absolute right-0 top-9 z-20 min-w-[140px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                        <Link
                                            href={`/maintenance/${contract.id}`}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            <Eye size={13} /> View
                                        </Link>
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => {
                                                onEdit(contract.id);
                                                setOpenMenu(null);
                                            }}
                                        >
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]"
                                            onClick={() => {
                                                onDelete(contract.id);
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
                        Showing {filtered.length} of {totalContracts} contracts
                    </p>
                </div>
            </div>
        </div>
    );
}
