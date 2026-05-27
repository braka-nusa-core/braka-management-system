"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
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
import type {
    BillingType,
    CreateMaintenanceRequest,
    MaintenanceContract,
    MaintenanceStatus,
} from "@/types/maintenance";

interface ClientOption {
    id: string;
    name: string;
}

interface MaintenanceFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: MaintenanceContract | null;
    clientOptions?: ClientOption[];
    onSubmit?: (payload: CreateMaintenanceRequest) => Promise<void>;
    isSubmitting?: boolean;
}

export function MaintenanceFormModal({
    open,
    onClose,
    editData,
    clientOptions = [],
    onSubmit,
    isSubmitting = false,
}: MaintenanceFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        serviceName: editData?.serviceName ?? "",
        billingType: editData?.billingType ?? ("monthly" satisfies BillingType),
        price: editData?.price?.toString() ?? "",
        startDate: editData?.startDate ? editData.startDate.slice(0, 10) : "",
        nextDueDate: editData?.nextDueDate ? editData.nextDueDate.slice(0, 10) : "",
        status: editData?.status ?? ("active" satisfies MaintenanceStatus),
        notes: editData?.notes ?? "",
    });

    useEffect(() => {
        setForm({
            clientId: editData?.clientId ?? "",
            serviceName: editData?.serviceName ?? "",
            billingType: editData?.billingType ?? ("monthly" satisfies BillingType),
            price: editData?.price?.toString() ?? "",
            startDate: editData?.startDate ? editData.startDate.slice(0, 10) : "",
            nextDueDate: editData?.nextDueDate ? editData.nextDueDate.slice(0, 10) : "",
            status: editData?.status ?? ("active" satisfies MaintenanceStatus),
            notes: editData?.notes ?? "",
        });
    }, [editData]);

    function set(key: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!onSubmit) {
            onClose();
            return;
        }

        await onSubmit({
            client: form.clientId,
            serviceName: form.serviceName.trim(),
            billingType: form.billingType,
            price: Number(form.price),
            startDate: form.startDate,
            nextDueDate: form.nextDueDate,
            status: form.status,
            notes: form.notes.trim() || undefined,
        });
    }

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls =
        "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Contract" : "Add Maintenance Contract"}</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        {isEdit
                            ? "Update contract details below."
                            : "Fill in details to create a new maintenance contract."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 py-1">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Client</label>
                            <select
                                className={selectCls}
                                value={form.clientId}
                                onChange={(e) => set("clientId", e.target.value)}
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
                            <label className={labelCls}>Service Name</label>
                            <Input
                                placeholder="e.g. Annual AC Maintenance"
                                value={form.serviceName}
                                onChange={(e) => set("serviceName", e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Billing Type</label>
                                <select
                                    className={selectCls}
                                    value={form.billingType}
                                    onChange={(e) => set("billingType", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Price (Rp)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 2500000"
                                    value={form.price}
                                    onChange={(e) => set("price", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Start Date</label>
                                <Input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => set("startDate", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Next Due Date</label>
                                <Input
                                    type="date"
                                    value={form.nextDueDate}
                                    onChange={(e) => set("nextDueDate", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelCls}>Status</label>
                            <select
                                className={selectCls}
                                value={form.status}
                                onChange={(e) => set("status", e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelCls}>Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Optional notes about this contract..."
                                value={form.notes}
                                onChange={(e) => set("notes", e.target.value)}
                                disabled={isSubmitting}
                                className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50"
                            />
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
                                "Save Contract"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
