"use client";

import { AlertTriangle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { INVOICES } from "@/constants/mock-data/invoices";

interface DeleteInvoiceDialogProps {
    open: boolean;
    invoiceId: string | null;
    onClose: () => void;
}

export function DeleteInvoiceDialog({ open, invoiceId, onClose }: DeleteInvoiceDialogProps) {
    const invoice = INVOICES.find((i) => i.id === invoiceId);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle size={18} className="text-red-400" />
                    </div>
                    <DialogTitle>Delete Invoice</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#F4F4F5]">{invoice?.invoiceNumber}</span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                        Delete Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}