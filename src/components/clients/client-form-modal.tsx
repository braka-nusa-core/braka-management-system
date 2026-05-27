"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client } from "@/constants/mock-data/clients";

interface ClientFormModalProps {
    open: boolean;
    onClose: () => void;
    editData?: Client | null;
}

export function ClientFormModal({ open, onClose, editData }: ClientFormModalProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        companyName: editData?.companyName ?? "",
        picName: editData?.picName ?? "",
        email: editData?.email ?? "",
        phone: editData?.phone ?? "",
        address: editData?.address ?? "",
        notes: editData?.notes ?? "",
    });

    function handleChange(key: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
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

                <div className="space-y-3 py-1">
                    {fields.map((f) => (
                        <div key={f.key} className="space-y-1.5">
                            <label className="text-xs font-medium text-[#A1A1AA]">{f.label}</label>
                            <Input
                                type={f.type ?? "text"}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={(e) => handleChange(f.key, e.target.value)}
                            />
                        </div>
                    ))}

                    {/* Notes textarea */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#A1A1AA]">Notes</label>
                        <textarea
                            rows={3}
                            placeholder="Optional notes about this client..."
                            value={form.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose}>
                        {isEdit ? "Save Changes" : "Save Client"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}