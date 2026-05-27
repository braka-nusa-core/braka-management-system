"use client";

import { AlertTriangle } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegenerateLinkDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function RegenerateLinkDialog({ open, onClose, onConfirm }: RegenerateLinkDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                        <AlertTriangle size={18} className="text-amber-400" />
                    </div>
                    <DialogTitle>Regenerate Public Link?</DialogTitle>
                    <DialogDescription>
                        This will invalidate the current public link immediately. Anyone using the old link
                        will lose access. A new link will be generated.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <p className="text-xs text-amber-400/80">
                        ⚠ The old link cannot be recovered after regeneration.
                    </p>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        Yes, Regenerate Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}