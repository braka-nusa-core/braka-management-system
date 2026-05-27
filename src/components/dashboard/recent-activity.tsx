import { CheckCircle2, UserPlus, Wrench, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECENT_ACTIVITY, type Activity } from "@/constants/mock-data/dashboard";
import { SectionHeader } from "./section-header";

const ACTIVITY_CONFIG: Record<
  Activity["type"],
  { icon: React.ElementType; iconClass: string; dotClass: string }
> = {
  invoice_paid: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  client_created: {
    icon: UserPlus,
    iconClass: "text-[#A3E635]",
    dotClass: "bg-[#A3E635]",
  },
  maintenance_updated: {
    icon: Wrench,
    iconClass: "text-sky-400",
    dotClass: "bg-sky-500",
  },
  invoice_overdue: {
    icon: AlertTriangle,
    iconClass: "text-red-400",
    dotClass: "bg-red-500",
  },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader
        title="Recent Activity"
        description="Latest events across the system"
        className="mb-5"
      />

      <ol className="relative space-y-0">
        {RECENT_ACTIVITY.map((item, i) => {
          const config = ACTIVITY_CONFIG[item.type];
          const Icon = config.icon;
          const isLast = i === RECENT_ACTIVITY.length - 1;

          return (
            <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Timeline line */}
              {!isLast && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-white/[0.06]" />
              )}

              {/* Icon bubble */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18181B] ring-1 ring-white/[0.06]">
                <Icon size={14} className={config.iconClass} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-[#F4F4F5]">{item.description}</p>
                {item.meta && (
                  <p className="mt-0.5 truncate text-xs text-[#A1A1AA]">{item.meta}</p>
                )}
                <p className="mt-1 text-[11px] text-[#A1A1AA]/60">{item.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
