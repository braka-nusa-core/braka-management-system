"use client";

import { NotificationItem } from "./notification-item";
import { NotificationsEmptyState } from "./notifications-empty-state";
import type { Notification } from "@/types/notification";
import type { FilterTab } from "./notification-filter";

interface NotificationListProps {
    notifications: Notification[];
    filter: FilterTab;
    onMarkRead: (id: string) => void;
}

export function NotificationList({
    notifications,
    filter,
    onMarkRead,
}: NotificationListProps) {
    if (notifications.length === 0) {
        return <NotificationsEmptyState filter={filter} />;
    }

    return (
        <div className="divide-y divide-white/[0.04]">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={onMarkRead}
                />
            ))}
        </div>
    );
}
