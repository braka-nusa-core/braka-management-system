import { cn } from "@/lib/utils";
import { UPCOMING_INVOICES, type Invoice } from "@/constants/mock-data/dashboard";
import { SectionHeader } from "./section-header";

function formatRp(amount: number) { return `Rp ${amount.toLocaleString("id-ID")}`; }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_STYLES: Record<Invoice["status"], { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-500/10 text-emerald-400" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-400" },
  overdue: { label: "Overdue", className: "bg-red-500/10 text-red-400" },
};

export function UpcomingInvoices() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader title="Upcoming Due Invoices" description="Next invoices requiring attention" className="mb-4" />

      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Invoice", "Client", "Due Date", "Amount", "Status"].map((h) => (
                <th key={h} className="pb-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {UPCOMING_INVOICES.map((inv) => {
              const s = STATUS_STYLES[inv.status];
              return (
                <tr key={inv.id} className="table-row-hover border-b border-white/[0.04] last:border-0">
                  <td className="py-3 font-mono text-xs text-[#A1A1AA]">{inv.id}</td>
                  <td className="py-3 font-medium text-[#F4F4F5]">{inv.client}</td>
                  <td className="py-3 text-[#A1A1AA]">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 font-semibold text-[#F4F4F5]">{formatRp(inv.amount)}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", s.className)}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-2 sm:hidden">
        {UPCOMING_INVOICES.map((inv) => {
          const s = STATUS_STYLES[inv.status];
          return (
            <div key={inv.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#18181B] px-4 py-3 transition-colors hover:bg-[#18181B]/80">
              <div>
                <p className="text-sm font-medium text-[#F4F4F5]">{inv.client}</p>
                <p className="mt-0.5 font-mono text-xs text-[#A1A1AA]">{inv.id} · {formatDate(inv.dueDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#F4F4F5]">{formatRp(inv.amount)}</p>
                <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium", s.className)}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}