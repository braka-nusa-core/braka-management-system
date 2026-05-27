"use client";

import { cn } from "@/lib/utils";
import { NotificationTypeBadge, NotificationTypeIcon } from "./notification-type-badge";
import type { Notification } from "@/types/notification";

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

interface NotificationItemProps {
    notification: Notification;
    onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
    const { id, type, title, description, timestamp, read } = notification;

    return (
        <div
            className={cn(
                "group relative flex items-start gap-4 px-5 py-4",
                "transition-colors duration-150",
                !read ? "bg-white/[0.025]" : "hover:bg-white/[0.015]"
            )}
        >
            {!read && (
                <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-[#A3E635]" />
            )}

            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                <NotificationTypeIcon type={type} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p
                            className={cn(
                                "text-sm font-semibold leading-snug",
                                read ? "text-[#A1A1AA]" : "text-[#F4F4F5]"
                            )}
                        >
                            {title}
                        </p>
                        <NotificationTypeBadge type={type} />
                        {!read && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#A3E635]" />}
                    </div>
                    <span className="shrink-0 text-[11px] text-[#A1A1AA]/40">
                        {formatTimestamp(timestamp)}
                    </span>
                </div>

                <p
                    className={cn(
                        "mt-1 text-sm leading-relaxed",
                        read ? "text-[#A1A1AA]/60" : "text-[#A1A1AA]"
                    )}
                >
                    {description}
                </p>

                {!read && (
                    <button
                        onClick={() => onMarkRead(id)}
                        className={cn(
                            "mt-2 text-[11px] font-medium text-[#A3E635]",
                            "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            "focus-visible:opacity-100 focus-visible:outline-none"
                        )}
                    >
                        Mark as read {"->"}
                    </button>
                )}
            </div>
        </div>
    );
}
