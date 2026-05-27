"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Pencil,
    Trash2,
    Copy,
    RefreshCw,
    Plus,
    MoreHorizontal,
    ExternalLink,
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
import { useToast } from "@/lib/toast";
import {
    createProgressProject,
    deleteProgressProject,
    getClients,
    getProgressProjects,
    regenerateProgressToken,
    updateProgressProject,
} from "@/services";
import type { CreateProgressRequest, ProgressAdminProject } from "@/types/progress";

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function buildPublicUrl(token: string): string {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${base}/progress/${token}`;
}

export default function ProgressPage() {
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editProject, setEditProject] = useState<ProgressAdminProject | null>(null);
    const [deleteProject, setDeleteProject] = useState<ProgressAdminProject | null>(null);
    const [regenProject, setRegenProject] = useState<ProgressAdminProject | null>(null);
    const t = useToastActions();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["progress"],
        queryFn: getProgressProjects,
    });
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "options"],
        queryFn: getClients,
    });
    const createMutation = useMutation({
        mutationFn: (payload: CreateProgressRequest) => createProgressProject(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["progress"] });
            setCreateOpen(false);
            t.clientSaved();
        },
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateProgressRequest }) =>
            updateProgressProject(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["progress"] });
            setEditProject(null);
            t.clientSaved();
        },
    });
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProgressProject(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["progress"] });
            setDeleteProject(null);
            t.clientDeleted();
        },
    });
    const regenMutation = useMutation({
        mutationFn: (id: string) => regenerateProgressToken(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["progress"] });
            setRegenProject(null);
            t.clientSaved();
        },
    });

    const projects = data?.projects ?? [];
    const totalProjects = data?.pagination.total ?? projects.length;
    const filtered = projects.filter((project) =>
        [project.projectName, project.clientName].some((field) =>
            field.toLowerCase().includes(search.toLowerCase())
        )
    );
    const clientOptions =
        clientsData?.clients.map((client) => ({
            id: client.id,
            name: client.companyName,
        })) ?? [];

    function handleCopyUrl(token: string) {
        const url = buildPublicUrl(token);
        navigator.clipboard.writeText(url).catch(() => {});
        t.exportStarted();
        setOpenMenu(null);
    }

    async function handleCreateProject(payload: CreateProgressRequest) {
        try {
            await createMutation.mutateAsync(payload);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to create project",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please review the form and try again.",
            });
        }
    }

    async function handleUpdateProject(payload: CreateProgressRequest) {
        if (!editProject) {
            return;
        }

        try {
            await updateMutation.mutateAsync({ id: editProject.id, payload });
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to update project",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please review the form and try again.",
            });
        }
    }

    async function handleDeleteProject() {
        if (!deleteProject) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(deleteProject.id);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to delete project",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please try again.",
            });
        }
    }

    async function handleRegenConfirm() {
        if (!regenProject) {
            return;
        }

        try {
            await regenMutation.mutateAsync(regenProject.id);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to regenerate public token",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please try again.",
            });
        }
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

            <div className="mb-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search projects or clients..."
                    className="max-w-sm"
                />
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
                {isLoading ? (
                    <div className="p-10 text-center">
                        <p className="text-sm font-semibold text-[#F4F4F5]">
                            Loading progress projects...
                        </p>
                        <p className="mt-1 text-sm text-[#A1A1AA]">
                            Fetching the latest project data from the API.
                        </p>
                    </div>
                ) : error instanceof Error ? (
                    <div className="p-5">
                        <p className="text-sm font-semibold text-red-300">
                            Failed to load progress projects
                        </p>
                        <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        {[
                                            "Project Name",
                                            "Client",
                                            "Status",
                                            "Progress",
                                            "Last Updated",
                                            "Public Link",
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
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <EmptyState variant="search" />
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-[#F4F4F5]">
                                                        {project.projectName}
                                                    </p>
                                                    <p className="font-mono text-[11px] text-[#A1A1AA]">
                                                        {project.id}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-[#A1A1AA]">
                                                    {project.clientName}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <ProgressStatusBadge status={project.status} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <AdminProgressBar value={project.progress} />
                                                </td>
                                                <td className="px-4 py-3 text-[#A1A1AA]">
                                                    {formatDate(project.lastUpdated)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <code className="max-w-[120px] truncate rounded bg-[#18181B] px-2 py-1 font-mono text-[11px] text-[#A1A1AA]">
                                                            {project.publicToken}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                handleCopyUrl(project.publicToken)
                                                            }
                                                            className="flex h-6 w-6 items-center justify-center rounded text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]"
                                                            title="Copy public URL"
                                                        >
                                                            <Copy size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={`/progress/${project.publicToken}`}
                                                            target="_blank"
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                title="View public page"
                                                            >
                                                                <ExternalLink size={13} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            title="Edit"
                                                            onClick={() => setEditProject(project)}
                                                        >
                                                            <Pencil size={13} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 hover:text-amber-400"
                                                            title="Regenerate token"
                                                            onClick={() => setRegenProject(project)}
                                                        >
                                                            <RefreshCw size={13} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 hover:text-red-400"
                                                            title="Delete"
                                                            onClick={() => setDeleteProject(project)}
                                                        >
                                                            <Trash2 size={13} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-white/[0.06] lg:hidden">
                            {filtered.length === 0 && <EmptyState variant="search" />}
                            {filtered.map((project) => (
                                <div key={project.id} className="flex items-start justify-between px-4 py-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium text-[#F4F4F5]">
                                                {project.projectName}
                                            </p>
                                            <ProgressStatusBadge status={project.status} size="sm" />
                                        </div>
                                        <p className="mt-0.5 text-sm text-[#A1A1AA]">
                                            {project.clientName}
                                        </p>
                                        <div className="mt-2 max-w-[200px]">
                                            <AdminProgressBar value={project.progress} />
                                        </div>
                                        <p className="mt-1 text-xs text-[#A1A1AA]/60">
                                            {formatDate(project.lastUpdated)}
                                        </p>
                                    </div>
                                    <div className="relative ml-3 shrink-0">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === project.id ? null : project.id
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]"
                                        >
                                            <MoreHorizontal size={16} />
                                        </button>
                                        {openMenu === project.id && (
                                            <div className="absolute right-0 top-9 z-20 min-w-[160px] rounded-lg border border-white/[0.08] bg-[#18181B] py-1 shadow-xl">
                                                <Link
                                                    href={`/progress/${project.publicToken}`}
                                                    target="_blank"
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                                    onClick={() => setOpenMenu(null)}
                                                >
                                                    <ExternalLink size={13} /> View Public
                                                </Link>
                                                <button
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                                    onClick={() => {
                                                        setEditProject(project);
                                                        setOpenMenu(null);
                                                    }}
                                                >
                                                    <Pencil size={13} /> Edit
                                                </button>
                                                <button
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#F4F4F5] hover:bg-white/[0.05]"
                                                    onClick={() => handleCopyUrl(project.publicToken)}
                                                >
                                                    <Copy size={13} /> Copy URL
                                                </button>
                                                <button
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-white/[0.05]"
                                                    onClick={() => {
                                                        setRegenProject(project);
                                                        setOpenMenu(null);
                                                    }}
                                                >
                                                    <RefreshCw size={13} /> Regenerate
                                                </button>
                                                <button
                                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05]"
                                                    onClick={() => {
                                                        setDeleteProject(project);
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
                                Showing {filtered.length} of {totalProjects} projects
                            </p>
                        </div>
                    </>
                )}
            </div>

            <ProgressFormModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                clientOptions={clientOptions}
                onSubmit={handleCreateProject}
                isSubmitting={createMutation.isPending}
            />
            <ProgressFormModal
                open={!!editProject}
                onClose={() => setEditProject(null)}
                editData={editProject}
                clientOptions={clientOptions}
                onSubmit={handleUpdateProject}
                isSubmitting={updateMutation.isPending}
            />
            <DeleteProgressDialog
                open={!!deleteProject}
                project={deleteProject}
                onClose={() => setDeleteProject(null)}
                onConfirm={handleDeleteProject}
                isSubmitting={deleteMutation.isPending}
            />
            <RegenerateLinkDialog
                open={!!regenProject}
                onClose={() => setRegenProject(null)}
                onConfirm={handleRegenConfirm}
            />
        </DashboardLayout>
    );
}
