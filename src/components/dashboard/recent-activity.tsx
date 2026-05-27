import type { ElementType } from "react";
import { CheckCircle2, FilePlus2, UserPlus, Wrench } from "lucide-react";
import type { DashboardActivity } from "@/types/dashboard";
import { SectionHeader } from "./section-header";

const ACTIVITY_CONFIG: Record<
  DashboardActivity["type"],
  { icon: ElementType; iconClass: string }
> = {
  invoice_paid: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
  },
  client_created: {
    icon: UserPlus,
    iconClass: "text-[#A3E635]",
  },
  maintenance_created: {
    icon: Wrench,
    iconClass: "text-sky-400",
  },
  invoice_created: {
    icon: FilePlus2,
    iconClass: "text-amber-400",
  },
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface RecentActivityProps {
  activities: DashboardActivity[];
  isLoading?: boolean;
  errorMessage?: string;
}

export function RecentActivity({
  activities,
  isLoading = false,
  errorMessage,
}: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader
        title="Recent Activity"
        description="Latest events across the system"
        className="mb-5"
      />

      <ol className="relative space-y-0">
        {isLoading ? (
          <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            Loading recent activity...
          </li>
        ) : errorMessage ? (
          <li className="rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-6 text-sm text-red-200">
            {errorMessage}
          </li>
        ) : activities.length === 0 ? (
          <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-sm text-[#A1A1AA]">
            No recent activity yet.
          </li>
        ) : (
          activities.map((item, i) => {
            const config = ACTIVITY_CONFIG[item.type];
            const Icon = config.icon;
            const isLast = i === activities.length - 1;

            return (
              <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-white/[0.06]" />
                )}

                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18181B] ring-1 ring-white/[0.06]">
                  <Icon size={14} className={config.iconClass} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-[#F4F4F5]">
                    {item.description}
                  </p>
                  {item.meta ? (
                    <p className="mt-0.5 truncate text-xs text-[#A1A1AA]">
                      {item.meta}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-[#A1A1AA]/60">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ol>
    </div>
  );
}
