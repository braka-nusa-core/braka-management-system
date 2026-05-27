"use client";

import { useToast } from "@/lib/toast";

export function useToastActions() {
    const { toast } = useToast();

    return {
        clientSaved: () => toast({ type: "success", title: "Client saved", description: "Client information has been updated." }),
        clientDeleted: () => toast({ type: "success", title: "Client deleted", description: "The client has been removed." }),
        contractSaved: () => toast({ type: "success", title: "Contract saved", description: "Maintenance contract has been updated." }),
        contractDeleted: () => toast({ type: "success", title: "Contract deleted", description: "The contract has been removed." }),
        invoiceSaved: () => toast({ type: "success", title: "Invoice saved", description: "Invoice has been saved successfully." }),
        invoiceMarkedPaid: () => toast({ type: "success", title: "Invoice marked as paid", description: "Payment status has been updated." }),
        invoiceDeleted: () => toast({ type: "success", title: "Invoice deleted", description: "The invoice has been removed." }),
        notifRead: () => toast({ type: "info", title: "Marked as read", description: "Notification has been marked as read." }),
        allNotifsRead: () => toast({ type: "info", title: "All notifications read", description: "All notifications have been cleared." }),
        settingsSaved: () => toast({ type: "success", title: "Settings saved", description: "Your preferences have been updated." }),
        errorGeneric: () => toast({ type: "error", title: "Something went wrong", description: "Please try again." }),
        exportStarted: () => toast({ type: "info", title: "Export started", description: "Your PDF is being prepared." }),
    };
}