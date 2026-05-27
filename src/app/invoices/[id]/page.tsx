"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle2, FileDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { MarkPaidDialog } from "@/components/invoices/mark-paid-dialog";
import { DeleteInvoiceDialog } from "@/components/invoices/delete-invoice-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { INVOICES } from "@/constants/mock-data/invoices";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [markPaidOpen, setMarkPaidOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const t = useToastActions();

    const invoice = INVOICES.find((i) => i.id === id);
    if (!invoice) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-lg font-semibold text-[#F4F4F5]">Invoice not found</p>
                    <Button className="mt-6" onClick={() => router.push("/invoices")}>Back to Invoices</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={invoice.invoiceNumber}>
            <PageHeader
                title={invoice.invoiceNumber}
                description={`${invoice.clientName} · Due ${new Date(invoice.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                breadcrumbs={[{ label: "Invoices", href: "/invoices" }, { label: invoice.invoiceNumber }]}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                            <Button variant="ghost" size="sm" className="gap-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" onClick={() => setMarkPaidOpen(true)}>
                                <CheckCircle2 size={13} /> Mark as Paid
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="gap-1.5 border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20" onClick={() => t.exportStarted()}>
                            <FileDown size={13} /> Export PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/invoices?edit=" + id)}>
                            <Pencil size={13} /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20" onClick={() => setDeleteOpen(true)}>
                            <Trash2 size={13} /> Delete
                        </Button>
                    </div>
                }
            />

            <InvoicePreview invoice={invoice} />

            <MarkPaidDialog open={markPaidOpen} invoiceId={invoice.id} onClose={() => { setMarkPaidOpen(false); t.invoiceMarkedPaid(); }} />
            <DeleteInvoiceDialog open={deleteOpen} invoiceId={invoice.id} onClose={() => { setDeleteOpen(false); t.invoiceDeleted(); router.push("/invoices"); }} />
        </DashboardLayout>
    );
}