"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    ContractInfoCard,
    BillingInfoCard,
    ApiScopeNoteCard,
    RelatedInvoicesCard,
    ContractActivityCard,
} from "@/components/maintenance/maintenance-detail-card";
import { MaintenanceFormModal } from "@/components/maintenance/maintenance-form-modal";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { TwoColLayout } from "@/components/shared/section-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { AppLoader } from "@/components/shared/app-loader";
import { Button } from "@/components/ui/button";
import { CONTRACT_INVOICES, CONTRACT_ACTIVITY } from "@/constants/mock-data/maintenance";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import {
    deleteMaintenanceContract,
    getClients,
    getMaintenanceContractById,
    updateMaintenanceContract,
} from "@/services";
import type { CreateMaintenanceRequest } from "@/types/maintenance";

export default function MaintenanceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();
    const { toast } = useToast();
    const { data: contract, isLoading, error } = useQuery({
        queryKey: ["maintenance", id],
        queryFn: () => getMaintenanceContractById(id),
        enabled: Boolean(id),
    });
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "options"],
        queryFn: getClients,
    });
    const updateMutation = useMutation({
        mutationFn: (payload: CreateMaintenanceRequest) =>
            updateMaintenanceContract(id, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["maintenance"] }),
                queryClient.invalidateQueries({ queryKey: ["maintenance", id] }),
            ]);
            setEditOpen(false);
            t.contractSaved();
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => deleteMaintenanceContract(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["maintenance"] });
            t.contractDeleted();
            router.replace("/maintenance");
        },
    });

    const clientOptions =
        clientsData?.clients.map((client) => ({
            id: client.id,
            name: client.companyName,
        })) ?? [];

    async function handleUpdateContract(payload: CreateMaintenanceRequest) {
        try {
            await updateMutation.mutateAsync(payload);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to update contract",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please review the form and try again.",
            });
        }
    }

    async function handleDeleteContract() {
        try {
            await deleteMutation.mutateAsync();
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to delete contract",
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

    if (error || !contract) {
        return (
            <DashboardLayout title="Not Found">
                <EmptyState
                    title="Contract not found"
                    description={
                        error instanceof Error
                            ? error.message
                            : "The requested maintenance contract could not be found."
                    }
                    action={
                        <Button onClick={() => router.push("/maintenance")}>
                            Back to Maintenance
                        </Button>
                    }
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={contract.serviceName}>
            <PageHeader
                title={contract.serviceName}
                description={`${contract.clientName} · ${contract.billingType}`}
                breadcrumbs={[
                    { label: "Maintenance", href: "/maintenance" },
                    { label: contract.id },
                ]}
                action={
                    <div className="flex items-center gap-2">
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

            <TwoColLayout
                left={
                    <>
                        <BillingInfoCard contract={contract} />
                        <ApiScopeNoteCard />
                        <ContractActivityCard activities={CONTRACT_ACTIVITY[id] ?? []} />
                    </>
                }
                right={
                    <>
                        <ContractInfoCard contract={contract} />
                        <RelatedInvoicesCard invoices={CONTRACT_INVOICES[id] ?? []} />
                    </>
                }
                leftSpan={1}
            />

            <MaintenanceFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={contract}
                clientOptions={clientOptions}
                onSubmit={handleUpdateContract}
                isSubmitting={updateMutation.isPending}
            />
            <DeleteMaintenanceDialog
                open={deleteOpen}
                contractName={`${contract.serviceName} - ${contract.clientName}`}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteContract}
                isSubmitting={deleteMutation.isPending}
            />
        </DashboardLayout>
    );
}
