"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { MarkPaidDialog } from "@/components/invoices/mark-paid-dialog";
import { DeleteInvoiceDialog } from "@/components/invoices/delete-invoice-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { INVOICES } from "@/constants/mock-data/invoices";
import { useToastActions } from "@/hooks/use-toast-actions";

type View = "list" | "create" | "edit";

export default function InvoicesPage() {
  const [view, setView]             = useState<View>("list");
  const [editId, setEditId]         = useState<string | null>(null);
  const [markPaidId, setMarkPaidId] = useState<string | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const t = useToastActions();

  const editInvoice = INVOICES.find((i) => i.id === editId) ?? null;

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
          onClose={() => { setView("list"); setEditId(null); t.invoiceSaved(); }}
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
        onCreate={() => setView("create")}
        onEdit={(id) => { setEditId(id); setView("edit"); }}
        onDelete={(id) => setDeleteId(id)}
        onMarkPaid={(id) => setMarkPaidId(id)}
      />

      <MarkPaidDialog open={!!markPaidId} invoiceId={markPaidId} onClose={() => { setMarkPaidId(null); t.invoiceMarkedPaid(); }} />
      <DeleteInvoiceDialog open={!!deleteId} invoiceId={deleteId} onClose={() => { setDeleteId(null); t.invoiceDeleted(); }} />
    </DashboardLayout>
  );
}