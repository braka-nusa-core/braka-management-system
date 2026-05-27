"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { AdminProgressProject } from "@/constants/mock-data/project-progress";

const CLIENT_OPTIONS = [
    { id: "CLT-001", name: "PT Maju Bersama" },
    { id: "CLT-002", name: "CV Cipta Karya" },
    { id: "CLT-003", name: "UD Sinar Terang" },
    { id: "CLT-005", name: "CV Duta Niaga" },
    { id: "CLT-007", name: "UD Prima Mandiri" },
    { id: "CLT-008", name: "PT Bangun Sejahtera" },
];

const STATUS_OPTIONS = [
    "planning", "design", "development", "revision", "testing", "completed",
] as const;

interface ProgressFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: AdminProgressProject | null;
}

export function ProgressFormModal({ open, onClose, editData }: ProgressFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        projectName: editData?.projectName ?? "",
        status: editData?.status ?? "planning",
        progress: editData?.progress ?? 0,
        description: editData?.description ?? "",
    });

    const [milestones, setMilestones] = useState<{ title: string; completed: boolean }[]>(
        editData?.milestones ?? [{ title: "", completed: false }]
    );

    function set(k: keyof typeof form, v: string | number) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    function addMilestone() {
        setMilestones((p) => [...p, { title: "", completed: false }]);
    }
    function removeMilestone(i: number) {
        setMilestones((p) => p.filter((_, idx) => idx !== i));
    }
    function updateMilestone(i: number, field: "title" | "completed", value: string | boolean) {
        setMilestones((p) => p.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
    }

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls = "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Progress Project" : "New Progress Project"}</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        {isEdit ? "Update project details below." : "Fill in the details to create a new progress project."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-1">
                    {/* Client */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Client</label>
                        <select className={selectCls} value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
                            <option value="">Select a client...</option>
                            {CLIENT_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Project Name */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Project Name</label>
                        <Input placeholder="e.g. HQ Renovation Phase 2" value={form.projectName} onChange={(e) => set("projectName", e.target.value)} />
                    </div>

                    {/* Status + Progress */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Status</label>
                            <select className={selectCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelCls}>Progress (0–100)</label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="0"
                                value={form.progress}
                                onChange={(e) => set("progress", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Description</label>
                        <textarea
                            rows={3}
                            placeholder="Brief description of the project..."
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]"
                        />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className={labelCls}>Milestones</label>
                            <button
                                onClick={addMilestone}
                                className="flex items-center gap-1 text-[11px] text-[#A3E635] hover:text-[#b5f23f] transition-colors"
                            >
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {milestones.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#18181B] px-3 py-2.5">
                                    <input
                                        type="checkbox"
                                        checked={m.completed}
                                        onChange={(e) => updateMilestone(i, "completed", e.target.checked)}
                                        className="h-4 w-4 shrink-0 rounded accent-[#A3E635]"
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Milestone ${i + 1}`}
                                        value={m.title}
                                        onChange={(e) => updateMilestone(i, "title", e.target.value)}
                                        className="min-w-0 flex-1 bg-transparent text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA]/50 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => removeMilestone(i)}
                                        disabled={milestones.length === 1}
                                        className="shrink-0 text-[#A1A1AA] hover:text-red-400 transition-colors disabled:opacity-30"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose}>{isEdit ? "Save Changes" : "Create Project"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}