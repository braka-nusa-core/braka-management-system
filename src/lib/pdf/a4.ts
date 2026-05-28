import type {
  EstimateRowHeightOptions,
  InvoicePrintBranding,
  InvoicePrintFooterNotes,
  InvoicePrintPaymentDetails,
  PaginationCapacity,
} from "@/types/invoice-print";

export const A4_DIMENSIONS = {
  widthMm: 210,
  heightMm: 297,
  widthPx: 794,
  heightPx: 1123,
} as const;

export const A4_MARGINS = {
  top: 44,
  right: 44,
  bottom: 40,
  left: 44,
} as const;

export const PRINT_THEME = {
  accent: "#A3E635",
  accentSoft: "#EAF7B0",
  paper: "#FFFFFF",
  ink: "#111111",
  muted: "#666666",
  border: "#D9D9D9",
  grid: "#EAEAEA",
  tableHead: "#171717",
  tableHeadText: "#FFFFFF",
  pageBg: "#EEF1E8",
} as const;

export const PRINT_SPACING = {
  pageGap: 28,
  sectionGap: 20,
  cardGap: 14,
  tableRowGap: 0,
} as const;

export const PRINT_LAYOUT = {
  pageInnerWidth:
    A4_DIMENSIONS.widthPx - A4_MARGINS.left - A4_MARGINS.right,
  pageInnerHeight:
    A4_DIMENSIONS.heightPx - A4_MARGINS.top - A4_MARGINS.bottom,
  headerHeight: 188,
  clientSectionHeight: 168,
  summaryHeight: 116,
  footerHeight: 128,
  tableHeaderHeight: 42,
  continuationLabelHeight: 28,
} as const;

export const PRINT_ROW_ESTIMATE: EstimateRowHeightOptions = {
  charsPerLine: 58,
  maxLines: 2,
  rowHeight: 82,
} as const;

export const PRINT_PAGINATION_CAPACITY: PaginationCapacity = {
  singlePageRows: 5,
  firstPageRows: 6,
  middlePageRows: 9,
  lastPageRows: 5,
} as const;

export const DEFAULT_INVOICE_BRANDING: InvoicePrintBranding = {
  accentColor: PRINT_THEME.accent,
  companyName: "Braka Nusa Core",
  legalName: "PT. Braka Nusa Core",
  tagline: "Technology & Engineering Studio",
  addressLines: [
    "Jl. Tejens 8, Permata No.Kav 26, RT.12/RW.7",
    "Petamburan, Tanah Abang",
    "Jakarta Pusat, DKI Jakarta 10260",
    "Indonesia",
  ],
  email: "finance@brakanusacore.com",
  phone: "+62 812 1000 2083",
  website: "brakanusacore.com",
  taxId: "12.345.678.9-012.000",
};

export const DEFAULT_INVOICE_PAYMENT: InvoicePrintPaymentDetails = {
  paymentTerms: "Payment is due within 15 days from the invoice date.",
  bankName: "BCA - Bank Central Asia",
  accountNumber: "1237 2549 678",
  accountName: "PT. Braka Nusa Core",
  branch: "KCP Tomang",
};

export const DEFAULT_INVOICE_FOOTER_NOTES: InvoicePrintFooterNotes = {
  notesTitle: "Notes",
  notesBody:
    "Thank you for your trust and partnership. Should you have any questions, please feel free to contact us.",
};
