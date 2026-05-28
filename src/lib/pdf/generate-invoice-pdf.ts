import { jsPDF } from "jspdf";
import type { CapturedInvoicePageCanvas } from "@/types/invoice-print";

interface GenerateInvoicePdfOptions {
  fileName?: string;
}

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getInvoicePdfFileName(invoiceNumber?: string) {
  if (!invoiceNumber) {
    return "invoice.pdf";
  }

  const safeInvoiceNumber = sanitizeFileName(invoiceNumber);
  return safeInvoiceNumber.toLowerCase().endsWith(".pdf")
    ? safeInvoiceNumber
    : `${safeInvoiceNumber}.pdf`;
}

function getFittedPdfImageBox(
  canvasWidth: number,
  canvasHeight: number,
  pageWidth: number,
  pageHeight: number
) {
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let renderWidth = pageWidth;
  let renderHeight = renderWidth / canvasAspectRatio;

  if (renderHeight > pageHeight) {
    renderHeight = pageHeight;
    renderWidth = renderHeight * canvasAspectRatio;
  }

  return {
    width: renderWidth,
    height: renderHeight,
    x: (pageWidth - renderWidth) / 2,
    y: (pageHeight - renderHeight) / 2,
  };
}

export async function generateInvoicePdf(
  pages: CapturedInvoicePageCanvas[],
  options: GenerateInvoicePdfOptions = {}
) {
  if (pages.length === 0) {
    throw new Error("No captured invoice pages were provided for PDF generation.");
  }

  const sortedPages = [...pages].sort((left, right) => left.pageNumber - right.pageNumber);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  try {
    sortedPages.forEach((page, index) => {
      if (!page.canvas || page.width <= 0 || page.height <= 0) {
        throw new Error(`Captured canvas for page ${page.pageNumber} is invalid.`);
      }

      if (index > 0) {
        pdf.addPage("a4", "portrait");
      }

      const imageData = page.canvas.toDataURL("image/png");
      const fittedBox = getFittedPdfImageBox(
        page.width,
        page.height,
        pageWidth,
        pageHeight
      );

      pdf.addImage(
        imageData,
        "PNG",
        fittedBox.x,
        fittedBox.y,
        fittedBox.width,
        fittedBox.height,
        `invoice-page-${page.pageNumber}`,
        "FAST"
      );
    });

    const fileName =
      sanitizeFileName(options.fileName ?? "invoice.pdf") || "invoice.pdf";
    await pdf.save(fileName, { returnPromise: true });
  } finally {
    sortedPages.forEach((page) => {
      page.canvas.width = 0;
      page.canvas.height = 0;
    });
  }
}
