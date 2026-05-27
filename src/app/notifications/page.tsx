"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationFilter, type FilterTab } from "@/components/notifications/notification-filter";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS_DATA, type Notification } from "@/constants/mock-data/notifications";
import { useToastActions } from "@/hooks/use-toast-actions";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS_DATA);
  const t = useToastActions();

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = items.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    t.notifRead();
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    t.allNotifsRead();
  }

  return (
    <DashboardLayout title="Notifications">
      <PageHeader
        title="Notifications"
        description="Stay updated on invoices, payments, and contracts."
        breadcrumbs={[{ label: "Notifications" }]}
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
          <NotificationFilter active={filter} onChange={setFilter} unreadCount={unreadCount} />
          <p className="text-xs text-[#A1A1AA]">{filtered.length} notification{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <NotificationList notifications={filtered} filter={filter} onMarkRead={markRead} />
      </div>
    </DashboardLayout>
  );
}