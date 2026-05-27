"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { MarkPaidDialog } from "@/components/invoices/mark-paid-dialog";
import { DeleteInvoiceDialog } from "@/components/invoices/delete-invoice-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import {
  createInvoice,
  deleteInvoice,
  getClients,
  getInvoices,
  getMaintenanceContracts,
  markInvoiceAsPaid,
  updateInvoice,
} from "@/services";
import type { CreateInvoiceRequest } from "@/types/invoice";

type View = "list" | "create" | "edit";

export default function InvoicesPage() {
  const [view, setView] = useState<View>("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [markPaidId, setMarkPaidId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = useToastActions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
  const { data: clientsData } = useQuery({
    queryKey: ["clients", "options"],
    queryFn: getClients,
  });
  const { data: maintenanceData } = useQuery({
    queryKey: ["maintenance", "options"],
    queryFn: getMaintenanceContracts,
  });
  const createMutation = useMutation({
    mutationFn: (payload: CreateInvoiceRequest) => createInvoice(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setView("list");
      t.invoiceSaved();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateInvoiceRequest }) =>
      updateInvoice(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setView("list");
      setEditId(null);
      t.invoiceSaved();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setDeleteId(null);
      t.invoiceDeleted();
    },
  });
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markInvoiceAsPaid(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setMarkPaidId(null);
      t.invoiceMarkedPaid();
    },
  });

  const invoices = data?.invoices ?? [];
  const totalInvoices = data?.pagination.total ?? invoices.length;
  const editInvoice = invoices.find((invoice) => invoice.id === editId) ?? null;
  const markPaidInvoice =
    invoices.find((invoice) => invoice.id === markPaidId) ?? null;
  const deleteTargetInvoice =
    invoices.find((invoice) => invoice.id === deleteId) ?? null;
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

  async function handleCreateInvoice(payload: CreateInvoiceRequest) {
    try {
      await createMutation.mutateAsync(payload);
    } catch (mutationError) {
      toast({
        type: "error",
        title: "Failed to create invoice",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please review the form and try again.",
      });
    }
  }

  async function handleUpdateInvoice(payload: CreateInvoiceRequest) {
    if (!editId) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editId, payload });
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
    if (!deleteId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteId);
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
    if (!markPaidId) {
      return;
    }

    try {
      await markPaidMutation.mutateAsync(markPaidId);
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

  if (view === "create" || view === "edit") {
    return (
      <DashboardLayout title={view === "create" ? "Create Invoice" : "Edit Invoice"}>
        <PageHeader
          title={view === "create" ? "Create Invoice" : "Edit Invoice"}
          breadcrumbs={[
            { label: "Invoices", href: "/invoices" },
            { label: view === "create" ? "New Invoice" : editInvoice?.invoiceNumber ?? "Edit" },
          ]}
        />
        <InvoiceForm
          editData={view === "edit" ? editInvoice : null}
          onClose={() => {
            setView("list");
            setEditId(null);
          }}
          onSubmit={view === "create" ? handleCreateInvoice : handleUpdateInvoice}
          clientOptions={clientOptions}
          maintenanceOptions={maintenanceOptions}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Invoices">
      <PageHeader
        title="Invoices"
        description="Manage and track all client invoices."
        breadcrumbs={[{ label: "Invoices" }]}
        action={
          <Button size="sm" className="gap-2" onClick={() => setView("create")}>
            <Plus size={14} /> Create Invoice
          </Button>
        }
      />

      <InvoicesTable
        invoices={invoices}
        totalInvoices={totalInvoices}
        isLoading={isLoading}
        errorMessage={error instanceof Error ? error.message : null}
        onCreate={() => setView("create")}
        onEdit={(id) => {
          setEditId(id);
          setView("edit");
        }}
        onDelete={(id) => setDeleteId(id)}
        onMarkPaid={(id) => setMarkPaidId(id)}
      />

      <MarkPaidDialog
        open={!!markPaidId}
        invoiceNumber={markPaidInvoice?.invoiceNumber}
        clientName={markPaidInvoice?.clientName}
        amount={markPaidInvoice?.total}
        dueDate={markPaidInvoice?.dueDate}
        onClose={() => setMarkPaidId(null)}
        onConfirm={handleMarkPaid}
        isSubmitting={markPaidMutation.isPending}
      />
      <DeleteInvoiceDialog
        open={!!deleteId}
        invoiceNumber={deleteTargetInvoice?.invoiceNumber}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteInvoice}
        isSubmitting={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
