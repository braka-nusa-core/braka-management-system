import type { InvoiceItem } from "@/constants/mock-data/invoices";

function formatRp(v: number) { return `Rp ${v.toLocaleString("id-ID")}`; }

export function InvoiceItemsTable({ items }: { items: InvoiceItem[] }) {
    return (
        <div className="overflow-hidden rounded-lg border border-white/[0.08]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/[0.08] bg-[#18181B]">
                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Description</th>
                        <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Qty</th>
                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Unit Price</th>
                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr
                            key={item.id}
                            className={`border-b border-white/[0.05] last:border-0 ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}
                        >
                            <td className="px-4 py-3 text-[#F4F4F5]">{item.description}</td>
                            <td className="px-4 py-3 text-center text-[#A1A1AA]">{item.qty}</td>
                            <td className="px-4 py-3 text-right text-[#A1A1AA]">{formatRp(item.unitPrice)}</td>
                            <td className="px-4 py-3 text-right font-semibold text-[#F4F4F5]">{formatRp(item.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}