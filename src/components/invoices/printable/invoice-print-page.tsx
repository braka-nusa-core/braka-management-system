import type { ReactNode } from "react";
import { A4_DIMENSIONS, A4_MARGINS, PRINT_SPACING } from "@/lib/pdf/a4";
import { cn } from "@/lib/utils";

interface InvoicePrintPageProps {
  children: ReactNode;
  pageNumber: number;
  totalPages: number;
  className?: string;
}

export function InvoicePrintPage({
  children,
  pageNumber,
  totalPages,
  className,
}: InvoicePrintPageProps) {
  return (
    <section
      className={cn(
        "relative mx-auto overflow-hidden rounded-[18px] border border-black/8 bg-white text-[#111111] shadow-[0_20px_60px_rgba(17,17,17,0.12)]",
        className
      )}
      data-invoice-print-page="true"
      data-page-number={pageNumber}
      style={{
        width: `${A4_DIMENSIONS.widthPx}px`,
        minHeight: `${A4_DIMENSIONS.heightPx}px`,
        padding: `${A4_MARGINS.top}px ${A4_MARGINS.right}px ${A4_MARGINS.bottom}px ${A4_MARGINS.left}px`,
        marginBottom: `${PRINT_SPACING.pageGap}px`,
      }}
    >
      <div className="absolute right-8 top-6 text-[10px] font-medium uppercase tracking-[0.28em] text-[#A0A0A0]">
        Page {pageNumber} / {totalPages}
      </div>
      <div className="flex min-h-full flex-col">{children}</div>
    </section>
  );
}
