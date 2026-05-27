"use client";

import { CheckCircle2 } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { INVOICES } from "@/constants/mock-data/invoices";

interface MarkPaidDialogProps {
    open: boolean;
    invoiceId: string | null;
    onClose: () => void;
}

export function MarkPaidDialog({ open, invoiceId, onClose }: MarkPaidDialogProps) {
    const invoice = INVOICES.find((i) => i.id === invoiceId);

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
                        <span className="font-semibold text-[#F4F4F5]">{invoice?.invoiceNumber}</span>
                        {" "}from{" "}
                        <span className="font-semibold text-[#F4F4F5]">{invoice?.clientName}</span>
                        {" "}has been paid. This will update the invoice status to Paid.
                    </DialogDescription>
                </DialogHeader>

                {invoice && (
                    <div className="rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#A1A1AA]">Amount</span>
                            <span className="font-bold text-[#A3E635]">
                                Rp {invoice.total.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-[#A1A1AA]">Due Date</span>
                            <span className="text-sm text-[#F4F4F5]">
                                {new Date(invoice.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={onClose}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        <CheckCircle2 size={14} className="mr-1.5" /> Confirm Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}