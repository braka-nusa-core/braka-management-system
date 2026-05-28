import { PRINT_ROW_ESTIMATE } from "@/lib/pdf/a4";
import type { InvoicePrintLineItem } from "@/types/invoice-print";

function formatRp(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function InvoicePrintItemsTable({
  items,
  rowStart,
  carryOverLabel,
}: {
  items: InvoicePrintLineItem[];
  rowStart: number;
  carryOverLabel?: string;
}) {
  return (
    <section className="space-y-3">
      {carryOverLabel ? (
        <div className="inline-flex rounded-full border border-[#DDE9A7] bg-[#F6FBD8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#61761A]">
          {carryOverLabel}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[20px] border border-[#E1E1E1]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[#171717] text-white">
            <tr>
              <th className="w-[58px] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
                No.
              </th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Description
              </th>
              <th className="w-[64px] px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.2em]">
                Qty
              </th>
              <th className="w-[122px] px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.2em]">
                Unit Price
              </th>
              <th className="w-[132px] px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.2em]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              return (
                <tr
                  key={item.id}
                  className="align-top even:bg-[#FCFCFC]"
                  style={{ height: `${PRINT_ROW_ESTIMATE.rowHeight}px` }}
                >
                  <td className="border-t border-[#ECECEC] px-4 py-2.5 text-[11px] font-semibold text-[#2B2B2B]">
                    {rowStart + index}
                  </td>
                  <td className="border-t border-[#ECECEC] px-4 py-2.5">
                    <div className="space-y-1 overflow-hidden text-[11px] leading-[1.35] text-[#282828]">
                      {item.printableDescription.map((line, lineIndex) => (
                        <p key={`${item.id}-line-${lineIndex}`}>{line}</p>
                      ))}
                    </div>
                  </td>
                  <td className="border-t border-[#ECECEC] px-4 py-2.5 text-right text-[11px] font-medium text-[#3B3B3B]">
                    {item.qty}
                  </td>
                  <td className="border-t border-[#ECECEC] px-4 py-2.5 text-right text-[11px] font-medium text-[#3B3B3B]">
                    {formatRp(item.unitPrice)}
                  </td>
                  <td className="border-t border-[#ECECEC] px-4 py-2.5 text-right text-[11px] font-semibold text-[#171717]">
                    {formatRp(item.amount)}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-t border-[#ECECEC] px-4 py-12 text-center text-[12px] text-[#7A7A7A]"
                >
                  No invoice items available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
