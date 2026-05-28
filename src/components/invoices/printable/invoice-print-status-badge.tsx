import { cn } from "@/lib/utils";
import { INVOICE_PRINT_STATUS_META } from "@/types/invoice-print";
import type { InvoiceStatus } from "@/types/invoice";

const toneClasses = {
  neutral: "border-[#D9D9D9] bg-[#F6F6F6] text-[#444444]",
  accent: "border-[#D5ED7A] bg-[#F5FBD8] text-[#5F6F16]",
  success: "border-[#C6E7D2] bg-[#ECF8F1] text-[#1C6B3C]",
  warning: "border-[#F1D7BF] bg-[#FFF4EA] text-[#9A4C12]",
} as const;

export function InvoicePrintStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  const meta = INVOICE_PRINT_STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        toneClasses[meta.tone],
        className
      )}
    >
      {meta.label}
    </span>
  );
}
