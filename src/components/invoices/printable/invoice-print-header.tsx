import { Calendar, FileText } from "lucide-react";
import { PRINT_THEME } from "@/lib/pdf/a4";
import { InvoicePrintStatusBadge } from "./invoice-print-status-badge";
import type { Invoice } from "@/types/invoice";
import type { InvoicePrintBranding } from "@/types/invoice-print";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InvoicePrintHeader({
  invoice,
  branding,
}: {
  invoice: Invoice;
  branding: InvoicePrintBranding;
}) {
  const infoRows = [
    { label: "Invoice No.", value: invoice.invoiceNumber },
    { label: "Invoice Date", value: formatDate(invoice.invoiceDate) },
    { label: "Due Date", value: formatDate(invoice.dueDate) },
    { label: "Reference", value: invoice.maintenanceName ?? "-" },
  ];

  return (
    <header className="flex items-start justify-between gap-8">
      <div className="flex max-w-[58%] items-start gap-5">
        <div
          className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[16px] text-[30px] font-black"
          style={{
            background: `linear-gradient(180deg, ${branding.accentColor} 0%, ${PRINT_THEME.accentSoft} 100%)`,
            color: "#111111",
          }}
        >
          S
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[34px] font-bold leading-[0.9] tracking-[-0.04em] text-[#111111]">
              {branding.companyName}
            </p>
            <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.22em] text-[#7C7C7C]">
              {branding.tagline}
            </p>
          </div>

          <div className="h-[2px] w-20 rounded-full" style={{ backgroundColor: branding.accentColor }} />

          <div className="space-y-1 text-[11px] leading-5 text-[#505050]">
            <p className="text-[14px] font-semibold text-[#202020]">{branding.legalName}</p>
            {branding.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="pt-2 text-[11px]">
              <p>{branding.phone}</p>
              <p>{branding.email}</p>
              {branding.website ? <p>{branding.website}</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[260px] shrink-0 rounded-[24px] border border-[#E6E6E6] bg-[#FCFCFC] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[#7E7E7E]">
              Invoice
            </p>
            <div className="mt-3">
              <InvoicePrintStatusBadge status={invoice.status} />
            </div>
          </div>
          <div
            className="rounded-[14px] p-3"
            style={{ backgroundColor: `${branding.accentColor}22` }}
          >
            <FileText
              size={20}
              style={{ color: PRINT_THEME.ink }}
              strokeWidth={2.1}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[88px_10px_1fr] gap-2 border-b border-[#ECECEC] pb-3 text-[12px] last:border-b-0 last:pb-0"
            >
              <span className="font-semibold text-[#5E5E5E]">{row.label}</span>
              <span className="text-[#B5B5B5]">:</span>
              <span className="font-medium text-[#171717]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[11px] text-[#6B6B6B]">
          <Calendar size={12} />
          <span>
            {invoice.paidAt
              ? `Paid at ${formatDate(invoice.paidAt)}`
              : "Awaiting payment confirmation"}
          </span>
        </div>
      </div>
    </header>
  );
}
