import type { ElementType, ReactNode } from "react";
import { Landmark, NotebookPen, ShieldCheck } from "lucide-react";
import { PRINT_THEME } from "@/lib/pdf/a4";
import type {
  InvoicePrintFooterNotes,
  InvoicePrintPaymentDetails,
} from "@/types/invoice-print";

function FooterCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-[#E5E5E5] bg-[#FBFBFB] p-5">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${PRINT_THEME.accent}30` }}
        >
          <Icon size={15} className="text-[#232323]" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#616161]">
          {title}
        </p>
      </div>
      <div className="space-y-1.5 text-[11px] leading-5 text-[#5A5A5A]">
        {children}
      </div>
    </div>
  );
}

export function InvoicePrintFooter({
  payment,
  footerNotes,
}: {
  payment: InvoicePrintPaymentDetails;
  footerNotes: InvoicePrintFooterNotes;
}) {
  return (
    <footer className="grid grid-cols-3 gap-4">
      <FooterCard title="Payment Terms" icon={ShieldCheck}>
        <p>{payment.paymentTerms}</p>
      </FooterCard>

      <FooterCard title="Bank Details" icon={Landmark}>
        <p>
          <span className="font-semibold text-[#181818]">Bank</span>: {payment.bankName}
        </p>
        <p>
          <span className="font-semibold text-[#181818]">Account No.</span>:{" "}
          {payment.accountNumber}
        </p>
        <p>
          <span className="font-semibold text-[#181818]">Account Name</span>:{" "}
          {payment.accountName}
        </p>
        {payment.branch ? (
          <p>
            <span className="font-semibold text-[#181818]">Branch</span>:{" "}
            {payment.branch}
          </p>
        ) : null}
      </FooterCard>

      <FooterCard title={footerNotes.notesTitle} icon={NotebookPen}>
        <p>{footerNotes.notesBody}</p>
      </FooterCard>
    </footer>
  );
}
