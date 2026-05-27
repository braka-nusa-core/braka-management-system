"use client";

import { AlertTriangle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MAINTENANCE_CONTRACTS } from "@/constants/mock-data/maintenance";

interface DeleteMaintenanceDialogProps {
    open: boolean;
    contractId: string | null;
    onClose: () => void;
}

export function DeleteMaintenanceDialog({ open, contractId, onClose }: DeleteMaintenanceDialogProps) {
    const contract = MAINTENANCE_CONTRACTS.find((c) => c.id === contractId);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle size={18} className="text-red-400" />
                    </div>
                    <DialogTitle>Delete Contract</DialogTitle>
                    <DialogDescription className="text-[#A1A1AA]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#F4F4F5]">
                            {contract ? `${contract.serviceName} — ${contract.clientName}` : "this contract"}
                        </span>
                        ? This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    >
                        Delete Contract
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}