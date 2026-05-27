import { Bell } from "lucide-react";

interface NotificationsEmptyStateProps {
    filter: "all" | "unread" | "read";
}

const MESSAGES = {
    all: { title: "No notifications yet", desc: "You're all caught up. Notifications will appear here." },
    unread: { title: "No unread notifications", desc: "All caught up! Every notification has been read." },
    read: { title: "No read notifications", desc: "You haven't read any notifications yet." },
};

export function NotificationsEmptyState({ filter }: NotificationsEmptyStateProps) {
    const { title, desc } = MESSAGES[filter];
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18181B]">
                <Bell size={28} className="text-[#A1A1AA]" />
            </div>
            <p className="text-base font-semibold text-[#F4F4F5]">{title}</p>
            <p className="mt-1 max-w-xs text-sm text-[#A1A1AA]">{desc}</p>
        </div>
    );
}