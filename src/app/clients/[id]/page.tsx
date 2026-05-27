"use client";

import { useState } from "react";
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
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
    CLIENTS,
    CLIENT_MAINTENANCE,
    CLIENT_INVOICES,
    CLIENT_PROJECTS,
} from "@/constants/mock-data/clients";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();

    const client = CLIENTS.find((c) => c.id === id);

    if (!client) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-lg font-semibold text-[#F4F4F5]">Client not found</p>
                    <p className="mt-1 text-sm text-[#A1A1AA]">The client ID "{id}" does not exist.</p>
                    <Button className="mt-6" onClick={() => router.push("/clients")}>
                        Back to Clients
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const contracts = CLIENT_MAINTENANCE[id] ?? [];
    const invoices = CLIENT_INVOICES[id] ?? [];
    const projects = CLIENT_PROJECTS[id] ?? [];

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

            {/* ── Three-column-aware layout ─────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left column */}
                <div className="space-y-6 lg:col-span-1">
                    <ClientInfoCard client={client} />
                    <PublicProgressCard
                        clientName={client.companyName}
                        initialToken={client.progressToken}
                    />
                </div>

                {/* Right columns */}
                <div className="space-y-6 lg:col-span-2">
                    <ProjectProgressCard projects={projects} />
                    <MaintenanceContractsCard contracts={contracts} />
                    <InvoiceHistoryCard invoices={invoices} />
                </div>
            </div>

            <ClientFormModal
                open={editOpen}
                onClose={() => { setEditOpen(false); t.clientSaved(); }}
                editData={client}
            />
            <DeleteClientDialog
                open={deleteOpen}
                clientId={client.id}
                onClose={() => {
                    setDeleteOpen(false);
                    t.clientDeleted();
                    router.push("/clients");
                }}
            />
        </DashboardLayout>
    );
}