"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceTable } from "@/components/maintenance/maintenance-table";
import { MaintenanceFormModal } from "@/components/maintenance/maintenance-form-modal";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MAINTENANCE_CONTRACTS } from "@/constants/mock-data/maintenance";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function MaintenancePage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const t = useToastActions();

  const editContract = MAINTENANCE_CONTRACTS.find((c) => c.id === editId) ?? null;

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
        onAdd={() => setAddOpen(true)}
        onEdit={(id) => setEditId(id)}
        onDelete={(id) => setDeleteId(id)}
      />

      <MaintenanceFormModal open={addOpen} onClose={() => { setAddOpen(false); t.contractSaved(); }} />
      <MaintenanceFormModal open={!!editId} onClose={() => { setEditId(null); t.contractSaved(); }} editData={editContract} />
      <DeleteMaintenanceDialog open={!!deleteId} contractId={deleteId} onClose={() => { setDeleteId(null); t.contractDeleted(); }} />
    </DashboardLayout>
  );
}