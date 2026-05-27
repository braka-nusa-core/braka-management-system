"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteClientDialogProps {
    open: boolean;
    clientName?: string | null;
    onClose: () => void;
    onConfirm?: () => Promise<void> | void;
    isSubmitting?: boolean;
}

export function DeleteClientDialog({
    open,
    clientName,
    onClose,
    onConfirm,
    isSubmitting = false,
}: DeleteClientDialogProps) {
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
                    <DialogTitle>Delete Client</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#F4F4F5]">
                            {clientName ?? "this client"}
                        </span>
                        ? This action cannot be undone and will remove all associated data.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="bg-red-500/90 hover:bg-red-500 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Client"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
