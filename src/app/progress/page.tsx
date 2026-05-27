"use client";

import { useState } from "react";
import {
    Pencil, Trash2, Copy, RefreshCw,
    Plus, MoreHorizontal, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { ProgressStatusBadge } from "@/components/progress/progress-status-badge";
import { AdminProgressBar } from "@/components/progress/admin-progress-bar";
import { ProgressFormModal } from "@/components/progress/progress-form-modal";
import { DeleteProgressDialog } from "@/components/progress/delete-progress-dialog";
import { RegenerateLinkDialog } from "@/components/clients/regenerate-link-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useToastActions } from "@/hooks/use-toast-actions";
import {
    ADMIN_PROGRESS_PROJECTS,
    type AdminProgressProject,
} from "@/constants/mock-data/project-progress";

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function buildPublicUrl(token: string): string {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${base}/progress/${token}`;
}

export default function ProgressPage() {
    const [projects, setProjects] = useState<AdminProgressProject[]>(ADMIN_PROGRESS_PROJECTS);
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editProject, setEditProject] = useState<AdminProgressProject | null>(null);
    const [deleteProject, setDeleteProject] = useState<AdminProgressProject | null>(null);
    const [regenProject, setRegenProject] = useState<AdminProgressProject | null>(null);
    const t = useToastActions();

    const filtered = projects.filter((p) =>
        [p.projectName, p.clientName].some((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        )
    );

    function handleCopyUrl(token: string) {
        const url = buildPublicUrl(token);
        navigator.clipboard.writeText(url).catch(() => { });
        t.exportStarted();
        setOpenMenu(null);
    }

    function handleRegenConfirm() {
        if (!regenProject) return;
        const newToken = "brk_pg_" + Math.random().toString(36).slice(2, 12);
        setProjects((prev) =>
            prev.map((p) => p.id === regenProject.id ? { ...p, token: newToken } : p)
        );
        t.clientSaved();
        setRegenProject(null);
    }

    return (
        <DashboardLayout title="Progress">
            <PageHeader
                title="Progress"
                description="Manage public project progress pages for your clients."
                breadcrumbs={[{ label: "Progress" }]}
                action={
                    <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
                        <Plus size={14} /> New Project
                    </Button>
                }
            />

            {/* Search */}
            <div className="mb-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search projects or clients..."
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                {/* Desktop */}
                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["Project Name", "Client", "Status", "Progress", "Last Updated", "Public Link", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7}><EmptyState variant="search" /></td></tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#F4F4F5]">{p.projectName}</p>
                                        <p className="font-mono text-[11px] text-[#A1A1AA]">{p.id}</p>
                                    </td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">{p.clientName}</td>
                                    <td className="px-4 py-3"><ProgressStatusBadge status={p.status} /></td>
                                    <td className="px-4 py-3"><AdminProgressBar value={p.progress} /></td>
                                    <td className="px-4 py-3 text-[#A1A1AA]">{formatDate(p.lastUpdated)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <code className="max-w-[120px] truncate rounded bg-[#18181B] px-2 py-1 font-mono text-[11px] text-[#A1A1AA]">
                                                {p.token}
                                            </code>
                                            <button
                                                onClick={() => handleCopyUrl(p.token)}
                                                className="flex h-6 w-6 items-center justify-center rounded text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                                                title="Copy public URL"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link href={`/progress/${p.token}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View public page">
                                                    <ExternalLink size={13} />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => setEditProject(p)}>
                                                <Pencil size={13} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-amber-400" title="Regenerate token" onClick={() => setRegenProject(p)}>
                                                <RefreshCw size={13} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-400" title="Delete" onClick={() => setDeleteProject(p)}>
                                                <Trash2 size={13} />
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
                    {filtered.length === 0 && <EmptyState variant="search" />}
                    {filtered.map((p) => (
                        <div key={p.id} className="flex items-start justify-between px-4 py-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-[#F4F4F5]">{p.projectName}</p>
                                    <ProgressStatusBadge status={p.status} size="sm" />
                                </div>
                                <p className="mt-0.5 text-sm text-[#A1A1AA]">{p.clientName}</p>
                                <div className="mt-2 max-w-[200px]">
                                    <AdminProgressBar value={p.progress} />
                                </div>
                                <p className="mt-1 text-xs text-[#A1A1AA]/60">{formatDate(p.lastUpdated)}</p>
                            </div>
                            <div className="relative ml-3 shrink-0">
                                <button
                                    onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                {openMenu === p.id && (
                                    <div className="absolute right-0 top-9 z-20 min-w-[160px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                        <Link href={`/progress/${p.token}`} target="_blank"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            <ExternalLink size={13} /> View Public
                                        </Link>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => { setEditProject(p); setOpenMenu(null); }}>
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                            onClick={() => { handleCopyUrl(p.token); }}>
                                            <Copy size={13} /> Copy URL
                                        </button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-white/[0.05]"
                                            onClick={() => { setRegenProject(p); setOpenMenu(null); }}>
                                            <RefreshCw size={13} /> Regenerate
                                        </button>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]"
                                            onClick={() => { setDeleteProject(p); setOpenMenu(null); }}>
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
                        Showing {filtered.length} of {projects.length} projects
                    </p>
                </div>
            </div>

            <ProgressFormModal open={createOpen} onClose={() => { setCreateOpen(false); t.clientSaved(); }} />
            <ProgressFormModal open={!!editProject} onClose={() => { setEditProject(null); t.clientSaved(); }} editData={editProject} />
            <DeleteProgressDialog open={!!deleteProject} project={deleteProject} onClose={() => setDeleteProject(null)} />
            <RegenerateLinkDialog open={!!regenProject} onClose={() => setRegenProject(null)} onConfirm={handleRegenConfirm} />
        </DashboardLayout>
    );
}