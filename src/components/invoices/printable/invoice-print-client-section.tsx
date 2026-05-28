import { Building2, Mail } from "lucide-react";
import type { Invoice } from "@/types/invoice";

export function InvoicePrintClientSection({ invoice }: { invoice: Invoice }) {
  return (
    <section className="grid grid-cols-[1.15fr_0.85fr] gap-5">
      <div className="rounded-[22px] border border-[#E5E5E5] bg-[#FAFAFA] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8A8A8A]">
          Bill To
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-[20px] font-bold tracking-[-0.02em] text-[#151515]">
            {invoice.clientName}
          </p>
          <div className="space-y-1.5 text-[12px] leading-5 text-[#575757]">
            <div className="flex items-center gap-2">
              <Building2 size={13} className="text-[#8B8B8B]" />
              <span>Client account</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-[#8B8B8B]" />
              <span>{invoice.clientEmail}</span>
            </div>
            <p>Attn. Finance / Operations Team</p>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#E5E5E5] bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A8A8A]">
              Service
            </p>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#161616]">
              {invoice.maintenanceName ?? "General invoice"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A8A8A]">
              Status
            </p>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#161616]">
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </p>
          </div>
          <div className="col-span-2 border-t border-[#ECECEC] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A8A8A]">
              Document Notes
            </p>
            <p className="mt-2 text-[12px] leading-5 text-[#5A5A5A]">
              {invoice.notes ??
                "Prepared for project delivery and recurring maintenance billing."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
