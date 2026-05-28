"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PrintableInvoice } from "@/components/invoices/printable-invoice";
import { getInvoiceById } from "@/services";
import { Button } from "@/components/ui/button";

export default function InvoicePrintPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", id, "print"],
    queryFn: () => getInvoiceById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-[#111111]">
        <div>
          <p className="text-lg font-semibold">Loading invoice...</p>
          <p className="mt-2 text-sm text-neutral-500">
            Preparing invoice data for printing.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-[#111111]">
        <div>
          <p className="text-lg font-semibold">Failed to load invoice</p>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            {error instanceof Error ? error.message : "Please try again."}
          </p>
          <Button className="mt-6" onClick={() => window.close()}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-[#111111]">
        <div>
          <p className="text-lg font-semibold">Invoice not found</p>
          <p className="mt-2 text-sm text-neutral-500">
            The requested invoice could not be found.
          </p>
        </div>
      </div>
    );
  }

  return <PrintableInvoice invoice={invoice} />;
}
