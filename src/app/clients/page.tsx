"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import { createClient, deleteClient, getClients, updateClient } from "@/services";
import type { CreateClientRequest, UpdateClientRequest } from "@/types/client";

export default function ClientsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = useToastActions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
  const createClientMutation = useMutation({
    mutationFn: (payload: CreateClientRequest) => createClient(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      setAddOpen(false);
      t.clientSaved();
    },
  });
  const updateClientMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientRequest }) =>
      updateClient(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      setEditId(null);
      t.clientSaved();
    },
  });
  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      setDeleteId(null);
      t.clientDeleted();
    },
  });

  const clients = data?.clients ?? [];
  const totalClients = data?.pagination.total ?? clients.length;
  const editClient = clients.find((c) => c.id === editId) ?? null;
  const deleteTargetClient = clients.find((c) => c.id === deleteId) ?? null;

  async function handleCreateClient(payload: CreateClientRequest) {
    try {
      await createClientMutation.mutateAsync(payload);
    } catch (error) {
      toast({
        type: "error",
        title: "Failed to create client",
        description:
          error instanceof Error
            ? error.message
            : "Please review the form and try again.",
      });
    }
  }

  async function handleUpdateClient(payload: CreateClientRequest) {
    if (!editId) {
      return;
    }

    try {
      await updateClientMutation.mutateAsync({ id: editId, payload });
    } catch (error) {
      toast({
        type: "error",
        title: "Failed to update client",
        description:
          error instanceof Error
            ? error.message
            : "Please review the form and try again.",
      });
    }
  }

  async function handleDeleteClient() {
    if (!deleteId) {
      return;
    }

    try {
      await deleteClientMutation.mutateAsync(deleteId);
    } catch (error) {
      toast({
        type: "error",
        title: "Failed to delete client",
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    }
  }

  return (
    <DashboardLayout title="Clients">
      <PageHeader
        title="Clients"
        description="Manage your client accounts and information."
        breadcrumbs={[{ label: "Clients" }]}
        action={
          <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
            <UserPlus size={14} /> Add Client
          </Button>
        }
      />

      <ClientsTable
        clients={clients}
        totalClients={totalClients}
        isLoading={isLoading}
        errorMessage={error instanceof Error ? error.message : null}
        onAdd={() => setAddOpen(true)}
        onEdit={(id) => setEditId(id)}
        onDelete={(id) => setDeleteId(id)}
      />

      <ClientFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreateClient}
        isSubmitting={createClientMutation.isPending}
      />
      <ClientFormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        editData={editClient}
        onSubmit={handleUpdateClient}
        isSubmitting={updateClientMutation.isPending}
      />
      <DeleteClientDialog
        open={!!deleteId}
        clientName={deleteTargetClient?.companyName}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteClient}
        isSubmitting={deleteClientMutation.isPending}
      />
    </DashboardLayout>
  );
}
