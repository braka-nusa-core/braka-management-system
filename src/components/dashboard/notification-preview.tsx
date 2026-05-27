import { Bell, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS, type Notification } from "@/constants/mock-data/dashboard";
import { SectionHeader } from "./section-header";

const NOTIF_CONFIG: Record<
  Notification["type"],
  { icon: React.ElementType; iconClass: string; bg: string }
> = {
  overdue: {
    icon: AlertCircle,
    iconClass: "text-red-400",
    bg: "bg-red-500/10",
  },
  due_soon: {
    icon: Clock,
    iconClass: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  payment_received: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
};

export function NotificationPreview() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader
        title="Notifications"
        description="Recent alerts and updates"
        action={
          unreadCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A3E635] px-1.5 text-[10px] font-bold text-[#09090B]">
              {unreadCount}
            </span>
          ) : undefined
        }
        className="mb-4"
      />

      <ul className="space-y-2">
        {NOTIFICATIONS.map((notif) => {
          const config = NOTIF_CONFIG[notif.type];
          const Icon = config.icon;

          return (
            <li
              key={notif.id}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 transition-colors",
                notif.read
                  ? "bg-transparent"
                  : "bg-white/[0.03] ring-1 ring-white/[0.06]"
              )}
            >
              <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                <Icon size={14} className={config.iconClass} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[13px] leading-snug", notif.read ? "text-[#A1A1AA]" : "text-[#F4F4F5]")}>
                  {notif.message}
                </p>
                <p className="mt-1 text-[11px] text-[#A1A1AA]/60">{notif.timestamp}</p>
              </div>
              {!notif.read && (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A3E635]" />
              )}
            </li>
          );
        })}
      </ul>

      <button className="mt-3 w-full rounded-lg py-2 text-xs text-[#A1A1AA] transition-colors hover:bg-[#18181B] hover:text-[#F4F4F5]">
        View all notifications →
      </button>
    </div>
  );
}
