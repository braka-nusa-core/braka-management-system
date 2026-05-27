"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceTable } from "@/components/maintenance/maintenance-table";
import { MaintenanceFormModal } from "@/components/maintenance/maintenance-form-modal";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import {
  createMaintenanceContract,
  deleteMaintenanceContract,
  getClients,
  getMaintenanceContracts,
  updateMaintenanceContract,
} from "@/services";
import type {
  CreateMaintenanceRequest,
  UpdateMaintenanceRequest,
} from "@/types/maintenance";

export default function MaintenancePage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = useToastActions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenanceContracts,
  });
  const { data: clientsData } = useQuery({
    queryKey: ["clients", "options"],
    queryFn: getClients,
  });
  const createMutation = useMutation({
    mutationFn: (payload: CreateMaintenanceRequest) =>
      createMaintenanceContract(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setAddOpen(false);
      t.contractSaved();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMaintenanceRequest;
    }) => updateMaintenanceContract(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setEditId(null);
      t.contractSaved();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMaintenanceContract(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setDeleteId(null);
      t.contractDeleted();
    },
  });

  const contracts = data?.contracts ?? [];
  const totalContracts = data?.pagination.total ?? contracts.length;
  const editContract = contracts.find((contract) => contract.id === editId) ?? null;
  const deleteContract =
    contracts.find((contract) => contract.id === deleteId) ?? null;
  const clientOptions =
    clientsData?.clients.map((client) => ({
      id: client.id,
      name: client.companyName,
    })) ?? [];

  async function handleCreateContract(payload: CreateMaintenanceRequest) {
    try {
      await createMutation.mutateAsync(payload);
    } catch (mutationError) {
      toast({
        type: "error",
        title: "Failed to create contract",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please review the form and try again.",
      });
    }
  }

  async function handleUpdateContract(payload: CreateMaintenanceRequest) {
    if (!editId) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editId, payload });
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
    if (!deleteId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteId);
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

  return (
    <DashboardLayout title="Maintenance">
      <PageHeader
        title="Maintenance"
        description="Manage service contracts and recurring maintenance schedules."
        breadcrumbs={[{ label: "Maintenance" }]}
        action={
          <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add Contract
          </Button>
        }
      />

      <MaintenanceTable
        contracts={contracts}
        totalContracts={totalContracts}
        isLoading={isLoading}
        errorMessage={error instanceof Error ? error.message : null}
        onAdd={() => setAddOpen(true)}
        onEdit={(id) => setEditId(id)}
        onDelete={(id) => setDeleteId(id)}
      />

      <MaintenanceFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        clientOptions={clientOptions}
        onSubmit={handleCreateContract}
        isSubmitting={createMutation.isPending}
      />
      <MaintenanceFormModal
        open={!!editId}
        onClose={() => setEditId(null)}
        editData={editContract}
        clientOptions={clientOptions}
        onSubmit={handleUpdateContract}
        isSubmitting={updateMutation.isPending}
      />
      <DeleteMaintenanceDialog
        open={!!deleteId}
        contractName={
          deleteContract
            ? `${deleteContract.serviceName} - ${deleteContract.clientName}`
            : null
        }
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteContract}
        isSubmitting={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
