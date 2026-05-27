"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client, ClientStatus, CreateClientRequest } from "@/types/client";

interface ClientFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: Client | null;
    onSubmit?: (payload: CreateClientRequest) => Promise<void>;
    isSubmitting?: boolean;
}

export function ClientFormModal({
    open,
    onClose,
    editData,
    onSubmit,
    isSubmitting = false,
}: ClientFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        companyName: editData?.companyName ?? "",
        picName: editData?.picName ?? "",
        email: editData?.email ?? "",
        phone: editData?.phone ?? "",
        address: editData?.address ?? "",
        notes: editData?.notes ?? "",
        status: editData?.status ?? ("active" satisfies ClientStatus),
    });

    useEffect(() => {
        setForm({
            companyName: editData?.companyName ?? "",
            picName: editData?.picName ?? "",
            email: editData?.email ?? "",
            phone: editData?.phone ?? "",
            address: editData?.address ?? "",
            notes: editData?.notes ?? "",
            status: editData?.status ?? ("active" satisfies ClientStatus),
        });
    }, [editData]);

    function handleChange(key: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!onSubmit) {
            onClose();
            return;
        }

        await onSubmit({
            name: form.companyName.trim(),
            picName: form.picName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            notes: form.notes.trim() || undefined,
            status: form.status,
        });
    }

    const fields: { key: keyof typeof form; label: string; placeholder: string; type?: string }[] = [
        { key: "companyName", label: "Company Name", placeholder: "PT Maju Bersama" },
        { key: "picName", label: "PIC Name", placeholder: "Budi Santoso" },
        { key: "email", label: "Email", placeholder: "budi@company.co.id", type: "email" },
        { key: "phone", label: "Phone", placeholder: "0812-3456-7890", type: "tel" },
        { key: "address", label: "Address", placeholder: "Jl. Sudirman No. 12, Jakarta" },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Client" : "Add New Client"}</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        {isEdit ? "Update client information below." : "Fill in the details to add a new client."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 py-1">
                        {fields.map((f) => (
                            <div key={f.key} className="space-y-1.5">
                                <label className="text-xs font-medium text-[#A1A1AA]">{f.label}</label>
                                <Input
                                    type={f.type ?? "text"}
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={(e) => handleChange(f.key, e.target.value)}
                                    required={f.key !== "notes"}
                                    disabled={isSubmitting}
                                />
                            </div>
                        ))}

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[#A1A1AA]">Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Optional notes about this client..."
                                value={form.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                disabled={isSubmitting}
                                className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[#A1A1AA]">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => handleChange("status", e.target.value as ClientStatus)}
                                disabled={isSubmitting}
                                className="flex h-9 w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-1 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="prospect">Prospect</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                isEdit ? "Save Changes" : "Save Client"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
