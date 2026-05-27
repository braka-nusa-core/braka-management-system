import {
  Users,
  Wrench,
  FileText,
  AlertCircle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStatCardData } from "@/types/dashboard";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Wrench,
  FileText,
  AlertCircle,
  TrendingUp,
};

export function StatCard({ data }: { data: DashboardStatCardData }) {
  const Icon = ICON_MAP[data.icon] ?? FileText;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827] p-5",
        "card-hover cursor-default"
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#A3E635]/0 blur-2xl transition-all duration-500 group-hover:bg-[#A3E635]/6" />

      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181B] ring-1 ring-white/[0.06] transition-all duration-200 group-hover:ring-[#A3E635]/20">
          <Icon
            size={17}
            className="text-[#A3E635] transition-transform duration-200 group-hover:scale-110"
          />
        </div>
        {data.pill ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              data.pillTone === "negative"
                ? "bg-red-500/10 text-red-400"
                : data.pillTone === "neutral"
                  ? "bg-white/[0.06] text-[#D4D4D8]"
                  : "bg-emerald-500/10 text-emerald-400"
            )}
          >
            {data.pill}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-[#F4F4F5]">
          {data.value}
        </p>
        <p className="mt-0.5 text-[13px] text-[#A1A1AA]">{data.label}</p>
      </div>

      {data.description ? (
        <p className="mt-3 text-xs text-[#A1A1AA]">{data.description}</p>
      ) : null}

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#A3E635] to-transparent transition-all duration-300 group-hover:w-full" />
    </div>
  );
}
