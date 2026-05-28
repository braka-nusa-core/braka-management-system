import { PRINT_THEME } from "@/lib/pdf/a4";
import type { InvoicePrintSummary as InvoicePrintSummaryData } from "@/types/invoice-print";

function formatRp(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function InvoicePrintSummary({
  summary,
}: {
  summary: InvoicePrintSummaryData;
}) {
  return (
    <section className="ml-auto w-[320px] rounded-[22px] border border-[#E5E5E5] bg-white p-5">
      <div className="space-y-3 text-[12px]">
        <div className="flex items-center justify-between text-[#666666]">
          <span className="font-semibold uppercase tracking-[0.2em]">Subtotal</span>
          <span className="font-medium text-[#171717]">{formatRp(summary.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[#666666]">
          <span className="font-semibold uppercase tracking-[0.2em]">Tax</span>
          <span className="font-medium text-[#171717]">{formatRp(summary.taxAmount)}</span>
        </div>
        <div className="h-px bg-[#E7E7E7]" />
        <div
          className="flex items-center justify-between rounded-[16px] px-4 py-4"
          style={{ backgroundColor: `${PRINT_THEME.accent}22` }}
        >
          <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#111111]">
            Total
          </span>
          <span className="text-[22px] font-bold tracking-[-0.03em] text-[#111111]">
            {formatRp(summary.total)}
          </span>
        </div>
      </div>
    </section>
  );
}
