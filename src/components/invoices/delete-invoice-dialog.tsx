"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteInvoiceDialogProps {
    open: boolean;
    invoiceNumber?: string | null;
    onClose: () => void;
    onConfirm?: () => Promise<void> | void;
    isSubmitting?: boolean;
}

export function DeleteInvoiceDialog({
    open,
    invoiceNumber,
    onClose,
    onConfirm,
    isSubmitting = false,
}: DeleteInvoiceDialogProps) {
    async function handleConfirm() {
        if (!onConfirm) {
            onClose();
            return;
        }

        await onConfirm();
    }

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
                        <span className="font-semibold text-[#F4F4F5]">{invoiceNumber}</span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Invoice"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
