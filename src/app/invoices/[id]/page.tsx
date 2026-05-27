"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle2, FileDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { MarkPaidDialog } from "@/components/invoices/mark-paid-dialog";
import { DeleteInvoiceDialog } from "@/components/invoices/delete-invoice-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AppLoader } from "@/components/shared/app-loader";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import {
    deleteInvoice,
    getClients,
    getInvoiceById,
    getMaintenanceContracts,
    markInvoiceAsPaid,
    updateInvoice,
} from "@/services";
import type { CreateInvoiceRequest } from "@/types/invoice";

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);
    const [markPaidOpen, setMarkPaidOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();
    const { toast } = useToast();
    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ["invoice", id],
        queryFn: () => getInvoiceById(id),
        enabled: Boolean(id),
    });
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "options"],
        queryFn: getClients,
    });
    const { data: maintenanceData } = useQuery({
        queryKey: ["maintenance", "options"],
        queryFn: getMaintenanceContracts,
    });
    const updateMutation = useMutation({
        mutationFn: (payload: CreateInvoiceRequest) => updateInvoice(id, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["invoices"] }),
                queryClient.invalidateQueries({ queryKey: ["invoice", id] }),
            ]);
            setEditOpen(false);
            t.invoiceSaved();
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => deleteInvoice(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["invoices"] });
            t.invoiceDeleted();
            router.replace("/invoices");
        },
    });
    const markPaidMutation = useMutation({
        mutationFn: () => markInvoiceAsPaid(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["invoices"] }),
                queryClient.invalidateQueries({ queryKey: ["invoice", id] }),
            ]);
            setMarkPaidOpen(false);
            t.invoiceMarkedPaid();
        },
    });

    const clientOptions =
        clientsData?.clients.map((client) => ({
            id: client.id,
            name: client.companyName,
            email: client.email,
        })) ?? [];
    const maintenanceOptions =
        maintenanceData?.contracts.map((contract) => ({
            id: contract.id,
            label: `${contract.serviceName} (${contract.clientName})`,
        })) ?? [];

    async function handleUpdateInvoice(payload: CreateInvoiceRequest) {
        try {
            await updateMutation.mutateAsync(payload);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to update invoice",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please review the form and try again.",
            });
        }
    }

    async function handleDeleteInvoice() {
        try {
            await deleteMutation.mutateAsync();
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to delete invoice",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please try again.",
            });
        }
    }

    async function handleMarkPaid() {
        try {
            await markPaidMutation.mutateAsync();
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to mark invoice as paid",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please try again.",
            });
        }
    }

    if (isLoading) {
        return <AppLoader />;
    }

    if (error || !invoice) {
        return (
            <DashboardLayout title="Not Found">
                <EmptyState
                    title="Invoice not found"
                    description={
                        error instanceof Error
                            ? error.message
                            : "The requested invoice could not be found."
                    }
                    action={
                        <Button onClick={() => router.push("/invoices")}>
                            Back to Invoices
                        </Button>
                    }
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={invoice.invoiceNumber}>
            <PageHeader
                title={invoice.invoiceNumber}
                description={`${invoice.clientName} · Due ${new Date(invoice.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                breadcrumbs={[
                    { label: "Invoices", href: "/invoices" },
                    { label: invoice.invoiceNumber },
                ]}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                onClick={() => setMarkPaidOpen(true)}
                            >
                                <CheckCircle2 size={13} /> Mark as Paid
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                            onClick={() => t.exportStarted()}
                        >
                            <FileDown size={13} /> Export PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil size={13} /> Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 size={13} /> Delete
                        </Button>
                    </div>
                }
            />

            <InvoicePreview invoice={invoice} />

            <MarkPaidDialog
                open={markPaidOpen}
                invoiceNumber={invoice.invoiceNumber}
                clientName={invoice.clientName}
                amount={invoice.total}
                dueDate={invoice.dueDate}
                onClose={() => setMarkPaidOpen(false)}
                onConfirm={handleMarkPaid}
                isSubmitting={markPaidMutation.isPending}
            />
            <DeleteInvoiceDialog
                open={deleteOpen}
                invoiceNumber={invoice.invoiceNumber}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteInvoice}
                isSubmitting={deleteMutation.isPending}
            />
            {editOpen && (
                <div className="mt-6">
                    <InvoiceForm
                        editData={invoice}
                        onClose={() => setEditOpen(false)}
                        onSubmit={handleUpdateInvoice}
                        clientOptions={clientOptions}
                        maintenanceOptions={maintenanceOptions}
                        isSubmitting={updateMutation.isPending}
                    />
                </div>
            )}
        </DashboardLayout>
    );
}
