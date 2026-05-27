import type { ElementType } from "react";
import Link from "next/link";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";
import { SectionHeader } from "./section-header";

const NOTIF_CONFIG: Record<
  Notification["type"],
  { icon: ElementType; iconClass: string; bg: string }
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
  system: {
    icon: AlertCircle,
    iconClass: "text-sky-300",
    bg: "bg-sky-500/10",
  },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
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

interface NotificationPreviewProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading?: boolean;
  errorMessage?: string;
}

export function NotificationPreview({
  notifications,
  unreadCount,
  isLoading = false,
  errorMessage,
}: NotificationPreviewProps) {
  const previewItems = notifications.slice(0, 4);

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
        {isLoading ? (
          <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-6 text-sm text-[#A1A1AA]">
            Loading notifications...
          </li>
        ) : errorMessage ? (
          <li className="rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-6 text-sm text-red-200">
            {errorMessage}
          </li>
        ) : previewItems.length === 0 ? (
          <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-6 text-sm text-[#A1A1AA]">
            No notifications yet.
          </li>
        ) : (
          previewItems.map((notif) => {
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
                <div
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    config.bg
                  )}
                >
                  <Icon size={14} className={config.iconClass} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[13px] leading-snug",
                      notif.read ? "text-[#A1A1AA]" : "text-[#F4F4F5]"
                    )}
                  >
                    {notif.title}
                  </p>
                  <p className="mt-1 text-[12px] text-[#A1A1AA]">
                    {notif.description}
                  </p>
                  <p className="mt-1 text-[11px] text-[#A1A1AA]/60">
                    {formatTimestamp(notif.timestamp)}
                  </p>
                </div>
                {!notif.read ? (
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A3E635]" />
                ) : null}
              </li>
            );
          })
        )}
      </ul>

      <Link
        href="/notifications"
        className="mt-3 block w-full rounded-lg py-2 text-center text-xs text-[#A1A1AA] transition-colors hover:bg-[#18181B] hover:text-[#F4F4F5]"
      >
        View all notifications {"->"}
      </Link>
    </div>
  );
}
