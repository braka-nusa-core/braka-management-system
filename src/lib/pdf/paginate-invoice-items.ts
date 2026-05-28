import {
  PRINT_PAGINATION_CAPACITY,
  PRINT_ROW_ESTIMATE,
} from "@/lib/pdf/a4";
import type {
  InvoicePrintLineItem,
  InvoicePrintPageModel,
  PaginatedInvoiceDocument,
  PaginationCapacity,
} from "@/types/invoice-print";
import type { Invoice } from "@/types/invoice";

function normalizeDescriptionLines(description: string) {
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function wrapLine(line: string, charsPerLine: number) {
  if (line.length <= charsPerLine) {
    return [line];
  }

  const words = line.split(/\s+/).filter(Boolean);
  const wrapped: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    const candidate = `${current} ${word}`;

    if (candidate.length <= charsPerLine) {
      current = candidate;
      continue;
    }

    wrapped.push(current);
    current = word;
  }

  if (current) {
    wrapped.push(current);
  }

  return wrapped.length > 0 ? wrapped : [line.slice(0, charsPerLine)];
}

function clampDescription(description: string) {
  const normalized = normalizeDescriptionLines(description);
  const wrappedLines = normalized.flatMap((line) =>
    wrapLine(line, PRINT_ROW_ESTIMATE.charsPerLine)
  );

  const safeLines =
    wrappedLines.length > 0 ? wrappedLines : ["No description provided"];

  const clamped = safeLines.slice(0, PRINT_ROW_ESTIMATE.maxLines);
  const isTruncated = safeLines.length > PRINT_ROW_ESTIMATE.maxLines;

  if (isTruncated) {
    const lastLine = clamped[clamped.length - 1] ?? "";
    clamped[clamped.length - 1] = `${lastLine.replace(/[.,;:!?-]*$/, "")}...`;
  }

  return {
    printableDescription: clamped,
    isDescriptionTruncated: isTruncated,
  };
}

export function estimateInvoiceRowHeight() {
  return PRINT_ROW_ESTIMATE.rowHeight;
}

export function createPrintLineItems(invoice: Invoice): InvoicePrintLineItem[] {
  return invoice.items.map((item, index) => ({
    ...item,
    index: index + 1,
    ...clampDescription(item.description),
    estimatedHeight: estimateInvoiceRowHeight(),
  }));
}

function takeItemsForSlots(
  items: InvoicePrintLineItem[],
  limit: number
): InvoicePrintLineItem[] {
  return items.slice(0, Math.max(0, limit));
}

function createPage(
  kind: InvoicePrintPageModel["kind"],
  pageNumber: number,
  totalPages: number,
  items: InvoicePrintLineItem[],
  rowStart: number
): InvoicePrintPageModel {
  return {
    kind,
    pageNumber,
    totalPages,
    items,
    rowStart,
    showClientSection: kind === "single" || kind === "first",
    showSummary: kind === "single" || kind === "last",
    showFooter: kind === "single" || kind === "last",
    carryOverLabel:
      kind === "middle" || kind === "last" ? "Continued invoice items" : undefined,
  };
}

export function paginateInvoiceItems(
  invoice: Invoice,
  capacity: PaginationCapacity = PRINT_PAGINATION_CAPACITY
): PaginatedInvoiceDocument {
  const items = createPrintLineItems(invoice);
  const summary = {
    subtotal: invoice.subtotal,
    taxAmount: Math.max(0, invoice.total - invoice.subtotal),
    total: invoice.total,
  };

  if (items.length === 0) {
    return {
      summary,
      pages: [createPage("single", 1, 1, [], 1)],
    };
  }

  if (items.length <= capacity.singlePageRows) {
    return {
      summary,
      pages: [createPage("single", 1, 1, items, 1)],
    };
  }

  const pages: Array<{
    kind: InvoicePrintPageModel["kind"];
    items: InvoicePrintLineItem[];
    rowStart: number;
  }> = [];

  let remaining = [...items];
  let rowStart = 1;

  const firstItems = takeItemsForSlots(remaining, capacity.firstPageRows);
  pages.push({ kind: "first", items: firstItems, rowStart });
  remaining = remaining.slice(firstItems.length);
  rowStart += firstItems.length;

  while (remaining.length > 0) {
    const fitsLastPage = remaining.length <= capacity.lastPageRows;

    if (fitsLastPage) {
      pages.push({ kind: "last", items: remaining, rowStart });
      remaining = [];
      break;
    }

    const middleItems = takeItemsForSlots(remaining, capacity.middlePageRows);

    pages.push({ kind: "middle", items: middleItems, rowStart });
    remaining = remaining.slice(middleItems.length);
    rowStart += middleItems.length;
  }

  const totalPages = pages.length;

  return {
    summary,
    pages: pages.map((page, index) =>
      createPage(page.kind, index + 1, totalPages, page.items, page.rowStart)
    ),
  };
}
