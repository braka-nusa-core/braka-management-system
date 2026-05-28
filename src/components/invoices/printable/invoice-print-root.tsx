import {
  DEFAULT_INVOICE_BRANDING,
  DEFAULT_INVOICE_FOOTER_NOTES,
  DEFAULT_INVOICE_PAYMENT,
  PRINT_THEME,
  PRINT_SPACING,
} from "@/lib/pdf/a4";
import { paginateInvoiceItems } from "@/lib/pdf/paginate-invoice-items";
import { InvoicePrintClientSection } from "./invoice-print-client-section";
import { InvoicePrintFooter } from "./invoice-print-footer";
import { InvoicePrintHeader } from "./invoice-print-header";
import { InvoicePrintItemsTable } from "./invoice-print-items-table";
import { InvoicePrintPage } from "./invoice-print-page";
import { InvoicePrintSummary } from "./invoice-print-summary";
import type { Invoice } from "@/types/invoice";
import type {
  InvoicePrintBranding,
  InvoicePrintFooterNotes,
  InvoicePrintPaymentDetails,
} from "@/types/invoice-print";

export function InvoicePrintRoot({
  invoice,
  branding = DEFAULT_INVOICE_BRANDING,
  payment = DEFAULT_INVOICE_PAYMENT,
  footerNotes = DEFAULT_INVOICE_FOOTER_NOTES,
  captureContainerId = "invoice-print-pages",
}: {
  invoice: Invoice;
  branding?: InvoicePrintBranding;
  payment?: InvoicePrintPaymentDetails;
  footerNotes?: InvoicePrintFooterNotes;
  captureContainerId?: string;
}) {
  const document = paginateInvoiceItems(invoice);

  return (
    <div className="px-6 py-10" style={{ backgroundColor: PRINT_THEME.pageBg }}>
      <div className="mx-auto max-w-[930px]">
        <div className="mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#667057]">
            Printable invoice preview
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5C6456]">
            Dedicated A4 invoice layout for future PDF capture. This page renders
            HTML-first pagination only in Phase 1.
          </p>
        </div>

        <div id={captureContainerId}>
          {document.pages.map((page) => (
            <InvoicePrintPage
              key={`${invoice.id}-print-page-${page.pageNumber}`}
              pageNumber={page.pageNumber}
              totalPages={page.totalPages}
            >
              <InvoicePrintHeader invoice={invoice} branding={branding} />

              <div style={{ height: `${PRINT_SPACING.sectionGap}px` }} />

              {page.showClientSection ? (
                <>
                  <InvoicePrintClientSection invoice={invoice} />
                  <div style={{ height: `${PRINT_SPACING.sectionGap}px` }} />
                </>
              ) : null}

              <InvoicePrintItemsTable
                items={page.items}
                rowStart={page.rowStart}
                carryOverLabel={page.carryOverLabel}
              />

              <div className="flex-1" />

              {page.showSummary ? (
                <>
                  <div style={{ height: `${PRINT_SPACING.sectionGap}px` }} />
                  <InvoicePrintSummary summary={document.summary} />
                </>
              ) : null}

              {page.showFooter ? (
                <>
                  <div style={{ height: `${PRINT_SPACING.sectionGap}px` }} />
                  <InvoicePrintFooter payment={payment} footerNotes={footerNotes} />
                </>
              ) : null}
            </InvoicePrintPage>
          ))}
        </div>
      </div>
    </div>
  );
}
