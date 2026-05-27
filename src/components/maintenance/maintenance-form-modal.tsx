"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLIENT_OPTIONS, type MaintenanceContract } from "@/constants/mock-data/maintenance";

interface MaintenanceFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: MaintenanceContract | null;
}

export function MaintenanceFormModal({ open, onClose, editData }: MaintenanceFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        serviceName: editData?.serviceName ?? "",
        billingType: editData?.billingType ?? "monthly",
        price: editData?.price?.toString() ?? "",
        startDate: editData?.startDate ?? "",
        nextDueDate: editData?.nextDueDate ?? "",
        status: editData?.status ?? "active",
        notes: editData?.notes ?? "",
        reminderDaysBefore: editData?.reminderDaysBefore?.toString() ?? "7",
        autoRenew: editData?.autoRenew ?? false,
    });

    function set(key: keyof typeof form, value: string | boolean) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls = "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Contract" : "Add Maintenance Contract"}</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        {isEdit ? "Update contract details below." : "Fill in details to create a new maintenance contract."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-1">
                    {/* Client */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Client</label>
                        <select className={selectCls} value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
                            <option value="">Select a client...</option>
                            {CLIENT_OPTIONS.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service Name */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Service Name</label>
                        <Input placeholder="e.g. Annual AC Maintenance" value={form.serviceName} onChange={(e) => set("serviceName", e.target.value)} />
                    </div>

                    {/* Billing Type + Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Billing Type</label>
                            <select className={selectCls} value={form.billingType} onChange={(e) => set("billingType", e.target.value)}>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelCls}>Price (Rp)</label>
                            <Input type="number" placeholder="e.g. 2500000" value={form.price} onChange={(e) => set("price", e.target.value)} />
                        </div>
                    </div>

                    {/* Start Date + Next Due */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Start Date</label>
                            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelCls}>Next Due Date</label>
                            <Input type="date" value={form.nextDueDate} onChange={(e) => set("nextDueDate", e.target.value)} />
                        </div>
                    </div>

                    {/* Status + Reminder */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Status</label>
                            <select className={selectCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelCls}>Remind Before (days)</label>
                            <Input type="number" placeholder="7" value={form.reminderDaysBefore} onChange={(e) => set("reminderDaysBefore", e.target.value)} />
                        </div>
                    </div>

                    {/* Auto Renew */}
                    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3">
                        <input
                            type="checkbox"
                            id="autoRenew"
                            checked={form.autoRenew as boolean}
                            onChange={(e) => set("autoRenew", e.target.checked)}
                            className="h-4 w-4 rounded accent-[#A3E635]"
                        />
                        <div>
                            <label htmlFor="autoRenew" className="text-sm font-medium text-[#F4F4F5] cursor-pointer">Auto Renew</label>
                            <p className="text-xs text-[#A1A1AA]">Automatically generate invoice on due date</p>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className={labelCls}>Notes</label>
                        <textarea
                            rows={3}
                            placeholder="Optional notes about this contract..."
                            value={form.notes}
                            onChange={(e) => set("notes", e.target.value)}
                            className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose}>{isEdit ? "Save Changes" : "Save Contract"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}