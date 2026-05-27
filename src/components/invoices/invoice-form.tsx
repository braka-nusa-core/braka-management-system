"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVOICE_CLIENT_OPTIONS, MAINTENANCE_OPTIONS, type Invoice } from "@/constants/mock-data/invoices";

interface FormItem { id: string; description: string; qty: string; unitPrice: string; }

interface InvoiceFormProps {
    editData?: Invoice | null;
    onClose: () => void;
}

function newItem(): FormItem {
    return { id: crypto.randomUUID(), description: "", qty: "1", unitPrice: "" };
}

function calcAmount(qty: string, unit: string): number {
    return (parseFloat(qty) || 0) * (parseFloat(unit) || 0);
}

function formatRp(v: number) { return v > 0 ? `Rp ${v.toLocaleString("id-ID")}` : "—"; }

export function InvoiceForm({ editData, onClose }: InvoiceFormProps) {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        clientId: editData?.clientId ?? "",
        invoiceNumber: editData?.invoiceNumber ?? "INV-0045",
        invoiceDate: editData?.invoiceDate ?? new Date().toISOString().slice(0, 10),
        dueDate: editData?.dueDate ?? "",
        maintenance: editData?.relatedMaintenance ?? "",
        notes: editData?.notes ?? "",
        status: editData?.status ?? "draft",
    });

    const [items, setItems] = useState<FormItem[]>(
        editData?.items.map((i) => ({
            id: i.id,
            description: i.description,
            qty: String(i.qty),
            unitPrice: String(i.unitPrice),
        })) ?? [newItem()]
    );

    function setField(k: keyof typeof form, v: string) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    function addItem() { setItems((p) => [...p, newItem()]); }
    function removeItem(id: string) { setItems((p) => p.filter((i) => i.id !== id)); }
    function updateItem(id: string, k: keyof FormItem, v: string) {
        setItems((p) => p.map((i) => (i.id === id ? { ...i, [k]: v } : i)));
    }

    const subtotal = items.reduce((sum, i) => sum + calcAmount(i.qty, i.unitPrice), 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    const labelCls = "text-xs font-medium text-[#A1A1AA]";
    const selectCls = "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F4F5]">{isEdit ? "Edit Invoice" : "Create Invoice"}</h1>
                    <p className="text-sm text-[#A1A1AA]">{isEdit ? `Editing ${editData?.invoiceNumber}` : "Fill in details to create a new invoice."}</p>
                </div>
                <Button variant="outline" size="sm" onClick={onClose} className="gap-1.5">
                    <X size={14} /> Close
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* ── Left: Form ─────────────────────────────────────────── */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Invoice details */}
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Invoice Details</h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Client</label>
                                <select className={selectCls} value={form.clientId} onChange={(e) => setField("clientId", e.target.value)}>
                                    <option value="">Select a client...</option>
                                    {INVOICE_CLIENT_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Invoice Number</label>
                                <Input value={form.invoiceNumber} onChange={(e) => setField("invoiceNumber", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Invoice Date</label>
                                <Input type="date" value={form.invoiceDate} onChange={(e) => setField("invoiceDate", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Due Date</label>
                                <Input type="date" value={form.dueDate} onChange={(e) => setField("dueDate", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Status</label>
                                <select className={selectCls} value={form.status} onChange={(e) => setField("status", e.target.value)}>
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelCls}>Related Maintenance (optional)</label>
                                <select className={selectCls} value={form.maintenance} onChange={(e) => setField("maintenance", e.target.value)}>
                                    <option value="">None</option>
                                    {MAINTENANCE_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Line Items</h2>
                            <Button variant="outline" size="sm" className="gap-1.5" onClick={addItem}>
                                <Plus size={13} /> Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={item.id} className="group relative grid grid-cols-12 gap-2 rounded-lg border border-white/[0.06] bg-[#18181B] p-3">
                                    <div className="col-span-12 sm:col-span-5 space-y-1">
                                        {idx === 0 && <p className={labelCls}>Description</p>}
                                        <Input
                                            placeholder="Service description..."
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-4 sm:col-span-2 space-y-1">
                                        {idx === 0 && <p className={labelCls}>Qty</p>}
                                        <Input
                                            type="number"
                                            placeholder="1"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-8 sm:col-span-3 space-y-1">
                                        {idx === 0 && <p className={labelCls}>Unit Price</p>}
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-10 sm:col-span-2 space-y-1">
                                        {idx === 0 && <p className={labelCls}>Amount</p>}
                                        <div className="flex h-9 items-center rounded-md border border-white/[0.06] px-3 text-sm font-semibold text-[#A3E635]">
                                            {formatRp(calcAmount(item.qty, item.unitPrice))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 flex items-end justify-end">
                                        {idx === 0 && <div className="hidden sm:block h-4" />}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Notes</h2>
                        <textarea
                            rows={3}
                            placeholder="Payment instructions, terms, or additional notes..."
                            value={form.notes}
                            onChange={(e) => setField("notes", e.target.value)}
                            className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-sm text-[#F4F4F5] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A3E635]"
                        />
                    </div>
                </div>

                {/* ── Right: Summary ─────────────────────────────────────── */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Summary</h2>
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

                    {/* Client preview */}
                    {form.clientId && (() => {
                        const client = INVOICE_CLIENT_OPTIONS.find((c) => c.id === form.clientId);
                        if (!client) return null;
                        return (
                            <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
                                <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Bill To</h2>
                                <div className="space-y-1 text-sm">
                                    <p className="font-semibold text-[#F4F4F5]">{client.name}</p>
                                    <p className="text-[#A1A1AA]">{client.pic}</p>
                                    <p className="text-[#A1A1AA]">{client.email}</p>
                                    <p className="text-[#A1A1AA]">{client.phone}</p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button className="w-full" onClick={onClose}>
                            {isEdit ? "Save Changes" : "Save Invoice"}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}