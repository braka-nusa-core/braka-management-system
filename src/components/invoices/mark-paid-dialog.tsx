"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MarkPaidDialogProps {
    open: boolean;
    invoiceNumber?: string | null;
    clientName?: string | null;
    amount?: number;
    dueDate?: string;
    onClose: () => void;
    onConfirm?: () => Promise<void> | void;
    isSubmitting?: boolean;
}

export function MarkPaidDialog({
    open,
    invoiceNumber,
    clientName,
    amount,
    dueDate,
    onClose,
    onConfirm,
    isSubmitting = false,
}: MarkPaidDialogProps) {
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
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                    </div>
                    <DialogTitle>Mark as Paid</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        Confirm that{" "}
                        <span className="font-semibold text-[#F4F4F5]">{invoiceNumber}</span>{" "}
                        from{" "}
                        <span className="font-semibold text-[#F4F4F5]">{clientName}</span>{" "}
                        has been paid. This will update the invoice status to Paid.
                    </DialogDescription>
                </DialogHeader>

                {(amount !== undefined || dueDate) && (
                    <div className="rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3">
                        {amount !== undefined && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#A1A1AA]">Amount</span>
                                <span className="font-bold text-[#A3E635]">
                                    Rp {amount.toLocaleString("id-ID")}
                                </span>
                            </div>
                        )}
                        {dueDate && (
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm text-[#A1A1AA]">Due Date</span>
                                <span className="text-sm text-[#F4F4F5]">
                                    {new Date(dueDate).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={14} className="mr-1.5" /> Confirm Payment
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
