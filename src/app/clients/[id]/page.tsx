"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    ClientInfoCard,
    MaintenanceContractsCard,
    InvoiceHistoryCard,
    ProjectProgressCard,
} from "@/components/clients/client-detail-card";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog";
import { PublicProgressCard } from "@/components/clients/public-progress-card";
import { AppLoader } from "@/components/shared/app-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
    CLIENT_MAINTENANCE,
    CLIENT_INVOICES,
    CLIENT_PROJECTS,
} from "@/constants/mock-data/clients";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import { deleteClient, getClientById, updateClient } from "@/services";
import type { CreateClientRequest } from "@/types/client";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();
    const { toast } = useToast();
    const { data: client, isLoading, error } = useQuery({
        queryKey: ["client", id],
        queryFn: () => getClientById(id),
        enabled: Boolean(id),
    });
    const updateClientMutation = useMutation({
        mutationFn: (payload: CreateClientRequest) => updateClient(id, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["clients"] }),
                queryClient.invalidateQueries({ queryKey: ["client", id] }),
            ]);
            setEditOpen(false);
            t.clientSaved();
        },
    });
    const deleteClientMutation = useMutation({
        mutationFn: () => deleteClient(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["clients"] });
            t.clientDeleted();
            router.replace("/clients");
        },
    });

    async function handleUpdateClient(payload: CreateClientRequest) {
        try {
            await updateClientMutation.mutateAsync(payload);
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to update client",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Please review the form and try again.",
            });
        }
    }

    async function handleDeleteClient() {
        try {
            await deleteClientMutation.mutateAsync();
        } catch (mutationError) {
            toast({
                type: "error",
                title: "Failed to delete client",
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

    if (error || !client) {
        return (
            <DashboardLayout title="Not Found">
                <EmptyState
                    title="Client not found"
                    description={
                        error instanceof Error
                            ? error.message
                            : "The requested client could not be found."
                    }
                    action={
                        <Button onClick={() => router.push("/clients")}>
                            Back to Clients
                        </Button>
                    }
                />
            </DashboardLayout>
        );
    }

    const contracts = CLIENT_MAINTENANCE[client.id] ?? [];
    const invoices = CLIENT_INVOICES[client.id] ?? [];
    const projects = CLIENT_PROJECTS[client.id] ?? [];

    return (
        <DashboardLayout title={client.companyName}>
            <PageHeader
                title={client.companyName}
                description={`${client.picName} · ${client.email}`}
                breadcrumbs={[
                    { label: "Clients", href: "/clients" },
                    { label: client.companyName },
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                    <ClientInfoCard client={client} />
                    <PublicProgressCard
                        clientName={client.companyName}
                        initialToken={client.progressToken}
                    />
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <ProjectProgressCard projects={projects} />
                    <MaintenanceContractsCard contracts={contracts} />
                    <InvoiceHistoryCard invoices={invoices} />
                </div>
            </div>

            <ClientFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={client}
                onSubmit={handleUpdateClient}
                isSubmitting={updateClientMutation.isPending}
            />
            <DeleteClientDialog
                open={deleteOpen}
                clientName={client.companyName}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteClient}
                isSubmitting={deleteClientMutation.isPending}
            />
        </DashboardLayout>
    );
}
