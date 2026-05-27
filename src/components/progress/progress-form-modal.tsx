"use client";

import { FormEvent, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import type {
    CreateProgressRequest,
    ProgressAdminProject,
    ProjectStatus,
} from "@/types/progress";

const STATUS_OPTIONS = [
    "planning",
    "design",
    "development",
    "revision",
    "testing",
    "completed",
] as const;

interface ClientOption {
    id: string;
    name: string;
}

interface ProgressFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: ProgressAdminProject | null;
    clientOptions?: ClientOption[];
    onSubmit?: (payload: CreateProgressRequest) => Promise<void>;
    isSubmitting?: boolean;
}

export function ProgressFormModal({
    open,
    onClose,
    editData,
    clientOptions = [],
    onSubmit,
    isSubmitting = false,
}: ProgressFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        projectName: editData?.projectName ?? "",
        status: editData?.status ?? ("planning" satisfies ProjectStatus),
        progress: editData?.progress ?? 0,
        description: editData?.description ?? "",
    });

    const [milestones, setMilestones] = useState(
        editData?.milestones.map((milestone, index) => ({
            id: `${index}`,
            title: milestone.title,
            completed: Boolean(milestone.completed),
        })) ?? [{ id: crypto.randomUUID(), title: "", completed: false }]
    );

    useEffect(() => {
        setForm({
            clientId: editData?.clientId ?? "",
            projectName: editData?.projectName ?? "",
            status: editData?.status ?? ("planning" satisfies ProjectStatus),
            progress: editData?.progress ?? 0,
            description: editData?.description ?? "",
        });
        setMilestones(
            editData?.milestones.map((milestone, index) => ({
                id: `${index}`,
                title: milestone.title,
                completed: Boolean(milestone.completed),
            })) ?? [{ id: crypto.randomUUID(), title: "", completed: false }]
        );
    }, [editData]);

    function setField(key: keyof typeof form, value: string | number) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function addMilestone() {
        setMilestones((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title: "", completed: false },
        ]);
    }

    function removeMilestone(id: string) {
        setMilestones((prev) =>
            prev.length === 1 ? prev : prev.filter((milestone) => milestone.id !== id)
        );
    }

    function updateMilestone(
        id: string,
        key: "title" | "completed",
        value: string | boolean
    ) {
        setMilestones((prev) =>
            prev.map((milestone) =>
                milestone.id === id ? { ...milestone, [key]: value } : milestone
            )
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!onSubmit) {
            onClose();
            return;
        }

        await onSubmit({
            client: form.clientId,
            projectName: form.projectName.trim(),
            status: form.status,
            progress: form.progress,
            description: form.description.trim() || undefined,
            milestones: milestones
                .map((milestone) => ({
                    title: milestone.title.trim(),
                    completed: milestone.completed,
                }))
                .filter((milestone) => milestone.title.length > 0),
        });
    }

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls =
        "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Progress Project" : "Add Progress Project"}</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        {isEdit
                            ? "Update project details below."
                            : "Fill in the details to create a new progress project."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-1">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Client</label>
                            <select
                                className={selectCls}
                                value={form.clientId}
                                onChange={(e) => setField("clientId", e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Select a client...</option>
                                {clientOptions.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelCls}>Project Name</label>
                            <Input
                                value={form.projectName}
                                onChange={(e) => setField("projectName", e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Status</label>
                                <select
                                    className={selectCls}
                                    value={form.status}
                                    onChange={(e) => setField("status", e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Progress (%)</label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.progress}
                                    onChange={(e) =>
                                        setField(
                                            "progress",
                                            Math.min(
                                                100,
                                                Math.max(0, parseInt(e.target.value) || 0)
                                            )
                                        )
                                    }
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelCls}>Description</label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) => setField("description", e.target.value)}
                                disabled={isSubmitting}
                                className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-[#F4F4F5]">Milestones</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={addMilestone}
                                >
                                    <Plus size={13} /> Add
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {milestones.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        className="rounded-lg border border-white/[0.06] bg-[#18181B] p-3"
                                    >
                                        <div className="flex gap-2">
                                            <Input
                                                value={milestone.title}
                                                onChange={(e) =>
                                                    updateMilestone(
                                                        milestone.id,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Milestone title"
                                                disabled={isSubmitting}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(milestone.id)}
                                                className="flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                disabled={milestones.length === 1 || isSubmitting}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <label className="mt-3 flex items-center gap-2 text-sm text-[#A1A1AA]">
                                            <input
                                                type="checkbox"
                                                checked={milestone.completed}
                                                onChange={(e) =>
                                                    updateMilestone(
                                                        milestone.id,
                                                        "completed",
                                                        e.target.checked
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                className="h-4 w-4 rounded accent-[#A3E635]"
                                            />
                                            Completed
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Saving...
                                </>
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "Save Project"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
