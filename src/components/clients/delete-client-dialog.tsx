"use client";

import { AlertTriangle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CLIENTS } from "@/constants/mock-data/clients";

interface DeleteClientDialogProps {
    open: boolean;
    clientId: string | null;
    onClose: () => void;
}

export function DeleteClientDialog({ open, clientId, onClose }: DeleteClientDialogProps) {
    const client = CLIENTS.find((c) => c.id === clientId);

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
                            {client?.companyName ?? "this client"}
                        </span>
                        ? This action cannot be undone and will remove all associated data.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={onClose}
                        className="bg-red-500/90 hover:bg-red-500 text-white"
                    >
                        Delete Client
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}