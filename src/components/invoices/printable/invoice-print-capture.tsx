"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Download,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import {
  captureInvoicePagesToCanvas,
} from "@/lib/pdf/capture-invoice-pages";
import {
  generateInvoicePdf,
  getInvoicePdfFileName,
} from "@/lib/pdf/generate-invoice-pdf";

type ExportStage =
  | "idle"
  | "preparing"
  | "capturing"
  | "generating"
  | "downloading"
  | "success"
  | "error";

const EXPORT_STAGE_LABEL: Record<ExportStage, string> = {
  idle: "Ready to export",
  preparing: "Preparing invoice...",
  capturing: "Capturing pages...",
  generating: "Generating PDF...",
  downloading: "Downloading...",
  success: "PDF downloaded successfully.",
  error: "Failed to generate PDF.",
};

export function InvoicePrintCapture({
  containerId,
  invoiceNumber,
  autoStart = true,
}: {
  containerId: string;
  invoiceNumber?: string;
  autoStart?: boolean;
}) {
  const [stage, setStage] = useState<ExportStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPageCount, setCapturedPageCount] = useState<number>(0);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const hasAutoStartedRef = useRef(false);
  const isBusy =
    stage === "preparing" ||
    stage === "capturing" ||
    stage === "generating" ||
    stage === "downloading";

  const headline = useMemo(() => {
    if (stage === "success") {
      return "PDF downloaded successfully.";
    }

    if (stage === "error") {
      return "Failed to generate PDF.";
    }

    return "Exporting invoice PDF";
  }, [stage]);

  const helperText = useMemo(() => {
    if (stage === "success") {
      return "You may now close this page or return to the invoice list.";
    }

    if (stage === "error") {
      return (
        errorMessage ??
        "Failed to generate PDF. Please try again."
      );
    }

    if (stage === "idle") {
      return "The printable invoice is ready. Start the export when you are ready.";
    }

    return "We are preparing a high-quality multi-page PDF from the printable A4 invoice layout.";
  }, [errorMessage, stage]);

  const runExport = useCallback(async () => {
    if (isBusy) {
      return;
    }

    setErrorMessage(null);
    setCompletedAt(null);

    try {
      setStage("preparing");
      const root = document.getElementById(containerId);

      if (!root) {
        throw new Error("Printable invoice container could not be found.");
      }

      setStage("capturing");
      const canvases = await captureInvoicePagesToCanvas(root, {
        scale: 2,
        useDevicePixelRatio: true,
      });

      if (canvases.length === 0) {
        throw new Error("No invoice pages were captured for PDF generation.");
      }

      setCapturedPageCount(canvases.length);

      setStage("generating");
      const fileName = getInvoicePdfFileName(invoiceNumber);
      setStage("downloading");
      await generateInvoicePdf(canvases, {
        fileName,
      });

      setStage("success");
      setCompletedAt(new Date().toLocaleTimeString("id-ID"));
    } catch (error) {
      setStage("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate invoice PDF."
      );
    }
  }, [containerId, invoiceNumber, isBusy]);

  useEffect(() => {
    if (!autoStart || hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    void runExport();
  }, [autoStart, runExport]);

  return (
    <aside className="mb-6 rounded-[28px] border border-black/8 bg-white/90 p-6 text-[#161616] shadow-[0_14px_40px_rgba(17,17,17,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#667057]">
            Braka PDF Export
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#171717]">
            {headline}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5A5A5A]">
            {helperText}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {stage === "success" ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E7A0] bg-[#F6FBD8] px-4 py-2.5 text-sm font-semibold text-[#2B3217]">
              <CheckCircle2 size={16} />
              Download complete
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void runExport()}
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8E7A0] bg-[#F6FBD8] px-4 py-2.5 text-sm font-semibold text-[#2B3217] transition-colors hover:bg-[#EDF7C2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : stage === "error" ? (
              <RefreshCw size={16} />
            ) : (
              <Download size={16} />
            )}
            {isBusy
              ? EXPORT_STAGE_LABEL[stage]
              : stage === "error"
                ? "Retry Export"
                : stage === "success"
                  ? "Download Again"
                  : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#666666]">
        <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 font-medium">
          {EXPORT_STAGE_LABEL[stage]}
        </span>
        {capturedPageCount > 0 ? (
          <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 font-medium">
            {capturedPageCount} page{capturedPageCount > 1 ? "s" : ""} captured
          </span>
        ) : null}
        {completedAt ? (
          <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 font-medium">
            Completed at {completedAt}
          </span>
        ) : null}
      </div>

      {stage === "error" ? (
        <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#F1D7BF] bg-[#FFF4EA] p-4 text-sm text-[#9A4C12]">
          <CircleAlert size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-3">
            <p>{errorMessage ?? "Failed to generate PDF. Please try again."}</p>
            <button
              type="button"
              onClick={() => void runExport()}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-full border border-[#E7BC9A] bg-white px-3 py-1.5 text-xs font-semibold text-[#9A4C12] transition-colors hover:bg-[#FFF9F4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={13} />
              Retry export
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
