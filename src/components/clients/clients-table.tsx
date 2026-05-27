"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, MoreHorizontal, UserPlus } from "lucide-react";
import Link from "next/link";
import { ClientStatusBadge } from "./client-status-badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { SortHeader } from "@/components/shared/sort-header";
import { useTableSort } from "@/hooks/use-table-sort";
import { EmptyState } from "@/components/shared/empty-state";
import type { Client } from "@/types/client";

interface ClientsTableProps {
    clients: Client[];
    totalClients: number;
    isLoading?: boolean;
    errorMessage?: string | null;
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ClientsTable({
    clients,
    totalClients,
    isLoading = false,
    errorMessage,
    onAdd,
    onEdit,
    onDelete,
}: ClientsTableProps) {
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const filtered = clients.filter((c) => {
        const matchSearch = [c.companyName, c.picName, c.email].some((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        );
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const { sorted, sort, toggleSort } = useTableSort(filtered);

    if (isLoading) {
        return (
            <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-10 text-center">
                <p className="text-sm font-semibold text-[#F4F4F5]">Loading clients...</p>
                <p className="mt-1 text-sm text-[#A1A1AA]">Fetching the latest client data from the API.</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-sm font-semibold text-red-300">Failed to load clients</p>
                <p className="mt-1 text-sm text-red-200/80">{errorMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search clients..."
                        className="flex-1 sm:max-w-xs"
                    />
                    <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#18181B] p-1">
                        {["all", "active", "inactive", "prospect"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-[#A3E635] text-[#09090B]" : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                                    }`}
                            >
                                {s === "all" ? "All" : s}
                            </button>
                        ))}
                    </div>
                </div>
                <Button size="sm" className="shrink-0 gap-2" onClick={onAdd}>
                    <UserPlus size={14} /> Add Client
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <SortHeader label="Company" sortKey="companyName" sort={sort} onSort={toggleSort} />
                                <SortHeader label="PIC" sortKey="picName" sort={sort} onSort={toggleSort} />
                                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">Email</th>
                                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">Phone</th>
                                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">Status</th>
                                <SortHeader label="Projects" sortKey="totalProjects" sort={sort} onSort={toggleSort} />
                                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan={7}><EmptyState variant={search ? "search" : "clients"} /></td></tr>
                            ) : sorted.map((client) => (
                                <tr key={client.id} className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#F4F4F5]">{client.companyName}</p>
                                        <p className="font-mono text-[11px] text-[#A1A1AA]">{client.id}</p>
                                    </td>
                                    <td className="px-4 py-3 text-[#F4F4F5]">{client.picName}</td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">{client.email}</td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">{client.phone}</td>
                                    <td className="px-4 py-3"><ClientStatusBadge status={client.status} /></td>
                                    <td className="px-4 py-3 text-center font-semibold text-[#F4F4F5]">{client.totalProjects}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/clients/${client.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View"><Eye size={14} /></Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => onEdit(client.id)}><Pencil size={14} /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-400" title="Delete" onClick={() => onDelete(client.id)}><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="divide-y divide-white/[0.06] md:hidden">
                    {sorted.length === 0 && <EmptyState variant={search ? "search" : "clients"} />}
                    {sorted.map((client) => (
                        <div key={client.id} className="flex items-start justify-between px-4 py-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-[#F4F4F5]">{client.companyName}</p>
                                    <ClientStatusBadge status={client.status} />
                                </div>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">{client.picName}</p>
                                <p className="text-xs text-[#A1A1AA]">{client.email}</p>
                                <p className="mt-1 text-xs text-[#A1A1AA]">{client.totalProjects} projects</p>
                            </div>
                            <div className="relative ml-3 shrink-0">
                                <button
                                    onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {openMenu === client.id && (
                                    <div className="absolute right-0 top-9 z-20 min-w-[140px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                        <Link href={`/clients/${client.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]" onClick={() => setOpenMenu(null)}><Eye size={13} /> View</Link>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]" onClick={() => { onEdit(client.id); setOpenMenu(null); }}><Pencil size={13} /> Edit</button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]" onClick={() => { onDelete(client.id); setOpenMenu(null); }}><Trash2 size={13} /> Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/[0.06] px-4 py-3">
                    <p className="text-xs text-[#A1A1AA]">Showing {sorted.length} of {totalClients} clients</p>
                </div>
            </div>
        </div>
    );
}
