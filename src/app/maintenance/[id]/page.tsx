"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractInfoCard, BillingInfoCard, ReminderInfoCard, RelatedInvoicesCard, ContractActivityCard } from "@/components/maintenance/maintenance-detail-card";
import { MaintenanceFormModal } from "@/components/maintenance/maintenance-form-modal";
import { DeleteMaintenanceDialog } from "@/components/maintenance/delete-maintenance-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { TwoColLayout } from "@/components/shared/section-layout";
import { Button } from "@/components/ui/button";
import { MAINTENANCE_CONTRACTS, CONTRACT_INVOICES, CONTRACT_ACTIVITY } from "@/constants/mock-data/maintenance";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function MaintenanceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();

    const contract = MAINTENANCE_CONTRACTS.find((c) => c.id === id);
    if (!contract) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-lg font-semibold text-[#F4F4F5]">Contract not found</p>
                    <Button className="mt-6" onClick={() => router.push("/maintenance")}>Back to Maintenance</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={contract.serviceName}>
            <PageHeader
                title={contract.serviceName}
                description={`${contract.clientName} · ${contract.billingType}`}
                breadcrumbs={[{ label: "Maintenance", href: "/maintenance" }, { label: contract.id }]}
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
                            <Pencil size={13} /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20" onClick={() => setDeleteOpen(true)}>
                            <Trash2 size={13} /> Delete
                        </Button>
                    </div>
                }
            />

            <TwoColLayout
                left={
                    <>
                        <BillingInfoCard contract={contract} />
                        <ReminderInfoCard contract={contract} />
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

            <MaintenanceFormModal open={editOpen} onClose={() => { setEditOpen(false); t.contractSaved(); }} editData={contract} />
            <DeleteMaintenanceDialog open={deleteOpen} contractId={contract.id} onClose={() => { setDeleteOpen(false); t.contractDeleted(); router.push("/maintenance"); }} />
        </DashboardLayout>
    );
}   