import { cn } from "@/lib/utils";
import type { DashboardUpcomingInvoice } from "@/types/dashboard";
import { SectionHeader } from "./section-header";

function formatRp(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDueLabel(dueDate: string) {
  const due = new Date(dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round(
    (startOfDue.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    return { label: "Today", className: "bg-red-500/10 text-red-400" };
  }

  if (diffDays === 1) {
    return { label: "Tomorrow", className: "bg-amber-500/10 text-amber-400" };
  }

  return {
    label: `In ${diffDays} days`,
    className: "bg-sky-500/10 text-sky-300",
  };
}

interface UpcomingInvoicesProps {
  invoices: DashboardUpcomingInvoice[];
  isLoading?: boolean;
  errorMessage?: string;
}

export function UpcomingInvoices({
  invoices,
  isLoading = false,
  errorMessage,
}: UpcomingInvoicesProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader
        title="Upcoming Due Invoices"
        description="Next invoices requiring attention"
        className="mb-4"
      />

      <div className="hidden overflow-x-auto sm:block">
        {isLoading ? (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            Loading upcoming invoices...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-6 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            No upcoming invoices right now.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Invoice", "Client", "Due Date", "Amount", "Due In"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const due = getDueLabel(invoice.dueDate);

                return (
                  <tr
                    key={invoice.id}
                    className="table-row-hover border-b border-white/[0.04] last:border-0"
                  >
                    <td className="py-3 font-mono text-xs text-[#A1A1AA]">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 font-medium text-[#F4F4F5]">
                      {invoice.clientName}
                    </td>
                    <td className="py-3 text-[#A1A1AA]">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="py-3 font-semibold text-[#F4F4F5]">
                      {formatRp(invoice.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          due.className
                        )}
                      >
                        {due.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="space-y-2 sm:hidden">
        {isLoading ? (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            Loading upcoming invoices...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-6 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            No upcoming invoices right now.
          </div>
        ) : (
          invoices.map((invoice) => {
            const due = getDueLabel(invoice.dueDate);

            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3 transition-colors hover:bg-[#18181B]/80"
              >
                <div>
                  <p className="text-sm font-medium text-[#F4F4F5]">
                    {invoice.clientName}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-[#A1A1AA]">
                    {invoice.invoiceNumber} {"·"} {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#F4F4F5]">
                    {formatRp(invoice.total)}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                      due.className
                    )}
                  >
                    {due.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
