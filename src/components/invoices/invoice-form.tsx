"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
    CreateInvoiceRequest,
    CreateInvoiceItemRequest,
    Invoice,
    InvoiceStatus,
} from "@/types/invoice";

interface FormItem {
    id: string;
    description: string;
    qty: string;
    unitPrice: string;
}

interface ClientOption {
    id: string;
    name: string;
    email: string;
}

interface MaintenanceOption {
    id: string;
    label: string;
}

interface InvoiceFormProps {
    editData?: Invoice | null;
    onClose: () => void;
    onSubmit?: (payload: CreateInvoiceRequest) => Promise<void>;
    clientOptions?: ClientOption[];
    maintenanceOptions?: MaintenanceOption[];
    isSubmitting?: boolean;
}

function newItem(): FormItem {
    return { id: crypto.randomUUID(), description: "", qty: "1", unitPrice: "" };
}

function calcAmount(qty: string, unit: string): number {
    return (parseFloat(qty) || 0) * (parseFloat(unit) || 0);
}

function formatRp(v: number) {
    return v > 0 ? `Rp ${v.toLocaleString("id-ID")}` : "—";
}

export function InvoiceForm({
    editData,
    onClose,
    onSubmit,
    clientOptions = [],
    maintenanceOptions = [],
    isSubmitting = false,
}: InvoiceFormProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        invoiceNumber: editData?.invoiceNumber ?? "",
        invoiceDate: editData?.invoiceDate ? editData.invoiceDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        dueDate: editData?.dueDate ? editData.dueDate.slice(0, 10) : "",
        maintenance: editData?.maintenanceId ?? "",
        notes: editData?.notes ?? "",
        status: editData?.status ?? ("draft" satisfies InvoiceStatus),
    });

    const [items, setItems] = useState<FormItem[]>(
        editData?.items.map((item) => ({
            id: item.id,
            description: item.description,
            qty: String(item.qty),
            unitPrice: String(item.unitPrice),
        })) ?? [newItem()]
    );

    useEffect(() => {
        setForm({
            clientId: editData?.clientId ?? "",
            invoiceNumber: editData?.invoiceNumber ?? "",
            invoiceDate: editData?.invoiceDate ? editData.invoiceDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
            dueDate: editData?.dueDate ? editData.dueDate.slice(0, 10) : "",
            maintenance: editData?.maintenanceId ?? "",
            notes: editData?.notes ?? "",
            status: editData?.status ?? ("draft" satisfies InvoiceStatus),
        });

        setItems(
            editData?.items.map((item) => ({
                id: item.id,
                description: item.description,
                qty: String(item.qty),
                unitPrice: String(item.unitPrice),
            })) ?? [newItem()]
        );
    }, [editData]);

    function setField(key: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function addItem() {
        setItems((prev) => [...prev, newItem()]);
    }

    function removeItem(id: string) {
        setItems((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
    }

    function updateItem(id: string, key: keyof FormItem, value: string) {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!onSubmit) {
            onClose();
            return;
        }

        const payloadItems: CreateInvoiceItemRequest[] = items.map((item) => ({
            description: item.description.trim(),
            quantity: Number(item.qty),
            unitPrice: Number(item.unitPrice),
        }));

        await onSubmit({
            invoiceNumber: form.invoiceNumber.trim(),
            client: form.clientId,
            maintenance: form.maintenance || undefined,
            items: payloadItems,
            invoiceDate: form.invoiceDate,
            dueDate: form.dueDate,
            status: form.status,
            notes: form.notes.trim() || undefined,
        });
    }

    const subtotal = items.reduce((sum, item) => sum + calcAmount(item.qty, item.unitPrice), 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls =
        "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50";

    const selectedClient =
        clientOptions.find((client) => client.id === form.clientId) ?? null;

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F4F5]">
                        {isEdit ? "Edit Invoice" : "Create Invoice"}
                    </h1>
                    <p className="text-sm text-[#A1A1AA]">
                        {isEdit
                            ? `Editing ${editData?.invoiceNumber}`
                            : "Fill in details to create a new invoice."}
                    </p>
                </div>
                <Button variant="outline" size="sm" type="button" onClick={onClose} className="gap-1.5">
                    <X size={14} /> Close
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                            Invoice Details
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Client</label>
                                <select
                                    className={selectCls}
                                    value={form.clientId}
                                    onChange={(e) => setField("clientId", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select a client...</option>
                                    {clientOptions.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Invoice Number</label>
                                <Input
                                    value={form.invoiceNumber}
                                    onChange={(e) => setField("invoiceNumber", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Invoice Date</label>
                                <Input
                                    type="date"
                                    value={form.invoiceDate}
                                    onChange={(e) => setField("invoiceDate", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Due Date</label>
                                <Input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) => setField("dueDate", e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Status</label>
                                <select
                                    className={selectCls}
                                    value={form.status}
                                    onChange={(e) => setField("status", e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Related Maintenance (optional)</label>
                                <select
                                    className={selectCls}
                                    value={form.maintenance}
                                    onChange={(e) => setField("maintenance", e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="">None</option>
                                    {maintenanceOptions.map((maintenance) => (
                                        <option key={maintenance.id} value={maintenance.id}>
                                            {maintenance.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                                Line Items
                            </h2>
                            <Button variant="outline" size="sm" type="button" className="gap-1.5" onClick={addItem}>
                                <Plus size={13} /> Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative grid grid-cols-12 gap-2 rounded-lg border border-white/[0.06] bg-[#18181B] p-3"
                                >
                                    <div className="col-span-12 space-y-1 sm:col-span-5">
                                        {index === 0 && <p className={labelCls}>Description</p>}
                                        <Input
                                            placeholder="Service description..."
                                            value={item.description}
                                            onChange={(e) =>
                                                updateItem(item.id, "description", e.target.value)
                                            }
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1 sm:col-span-2">
                                        {index === 0 && <p className={labelCls}>Qty</p>}
                                        <Input
                                            type="number"
                                            placeholder="1"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-span-8 space-y-1 sm:col-span-3">
                                        {index === 0 && <p className={labelCls}>Unit Price</p>}
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                updateItem(item.id, "unitPrice", e.target.value)
                                            }
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-span-10 space-y-1 sm:col-span-2">
                                        {index === 0 && <p className={labelCls}>Amount</p>}
                                        <div className="flex h-9 items-center rounded-md border border-white/[0.06] px-3 text-sm font-semibold text-[#A3E635]">
                                            {formatRp(calcAmount(item.qty, item.unitPrice))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-end justify-end sm:col-span-1">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] transition-colors hover:bg-red-500/10 hover:text-red-400"
                                            disabled={items.length === 1 || isSubmitting}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                            Notes
                        </h2>
                        <textarea
                            rows={3}
                            placeholder="Payment instructions, terms, or additional notes..."
                            value={form.notes}
                            onChange={(e) => setField("notes", e.target.value)}
                            disabled={isSubmitting}
                            className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                            Summary
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#A1A1AA]">Subtotal</span>
                                <span className="font-medium text-[#F4F4F5]">{formatRp(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#A1A1AA]">PPN 11%</span>
                                <span className="font-medium text-[#F4F4F5]">{formatRp(tax)}</span>
                            </div>
                            <div className="h-px bg-white/[0.08]" />
                            <div className="flex justify-between rounded-lg bg-[#A3E635]/10 px-3 py-2">
                                <span className="font-bold text-[#F4F4F5]">Total</span>
                                <span className="font-bold text-[#A3E635]">{formatRp(total)}</span>
                            </div>
                        </div>
                    </div>

                    {selectedClient && (
                        <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                                Bill To
                            </h2>
                            <div className="space-y-1 text-sm">
                                <p className="font-semibold text-[#F4F4F5]">{selectedClient.name}</p>
                                <p className="text-[#A1A1AA]">{selectedClient.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Saving...
                                </>
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "Save Invoice"
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
