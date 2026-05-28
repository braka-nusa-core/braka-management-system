import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types/invoice";

export interface InvoicePrintBranding {
  accentColor: string;
  companyName: string;
  legalName: string;
  tagline: string;
  addressLines: string[];
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
}

export interface InvoicePrintPaymentDetails {
  paymentTerms: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
}

export interface InvoicePrintFooterNotes {
  notesTitle: string;
  notesBody: string;
}

export interface InvoicePrintLineItem extends InvoiceItem {
  index: number;
  printableDescription: string[];
  isDescriptionTruncated: boolean;
  estimatedHeight: number;
}

export interface InvoicePrintSummary {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export type InvoicePrintPageKind = "single" | "first" | "middle" | "last";

export interface InvoicePrintDocumentContext {
  invoice: Invoice;
  branding: InvoicePrintBranding;
  payment: InvoicePrintPaymentDetails;
  footerNotes: InvoicePrintFooterNotes;
  summary: InvoicePrintSummary;
  items: InvoicePrintLineItem[];
}

export interface InvoicePrintPageModel {
  kind: InvoicePrintPageKind;
  pageNumber: number;
  totalPages: number;
  items: InvoicePrintLineItem[];
  rowStart: number;
  showClientSection: boolean;
  showSummary: boolean;
  showFooter: boolean;
  carryOverLabel?: string;
}

export interface PaginatedInvoiceDocument {
  pages: InvoicePrintPageModel[];
  summary: InvoicePrintSummary;
}

export interface PaginationCapacity {
  singlePageRows: number;
  firstPageRows: number;
  middlePageRows: number;
  lastPageRows: number;
}

export interface EstimateRowHeightOptions {
  charsPerLine: number;
  maxLines: number;
  rowHeight: number;
}

export interface InvoicePrintStatusMeta {
  label: string;
  tone: "neutral" | "accent" | "success" | "warning";
}

export interface CapturedInvoicePageImage {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface CapturedInvoicePageCanvas {
  pageNumber: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

export interface CaptureInvoicePagesOptions {
  scale?: number;
  backgroundColor?: string;
  imageTimeoutMs?: number;
  waitAfterFontsMs?: number;
  waitAfterImagesMs?: number;
  useDevicePixelRatio?: boolean;
}

export const INVOICE_PRINT_STATUS_META: Record<
  InvoiceStatus,
  InvoicePrintStatusMeta
> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "accent" },
  paid: { label: "Paid", tone: "success" },
  overdue: { label: "Overdue", tone: "warning" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};
