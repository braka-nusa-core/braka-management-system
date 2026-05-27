"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CLIENTS } from "@/constants/mock-data/clients";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function ClientsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = useToastActions();

  const editClient = CLIENTS.find((c) => c.id === editId) ?? null;

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
        onAdd={() => setAddOpen(true)}
        onEdit={(id) => setEditId(id)}
        onDelete={(id) => setDeleteId(id)}
      />

      <ClientFormModal open={addOpen} onClose={() => { setAddOpen(false); t.clientSaved(); }} />
      <ClientFormModal open={!!editId} onClose={() => { setEditId(null); t.clientSaved(); }} editData={editClient} />
      <DeleteClientDialog open={!!deleteId} clientId={deleteId} onClose={() => { setDeleteId(null); t.clientDeleted(); }} />
    </DashboardLayout>
  );
}