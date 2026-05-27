"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationFilter, type FilterTab } from "@/components/notifications/notification-filter";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/hooks/use-toast-actions";
import { useToast } from "@/lib/toast";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const t = useToastActions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      t.notifRead();
    },
  });
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      t.allNotifsRead();
    },
  });

  const items = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? items.filter((n) => !n.read).length;

  const filtered = items.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  async function markRead(id: string) {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (mutationError) {
      toast({
        type: "error",
        title: "Failed to mark notification as read",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please try again.",
      });
    }
  }

  async function markAllRead() {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (mutationError) {
      toast({
        type: "error",
        title: "Failed to mark all notifications as read",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please try again.",
      });
    }
  }

  return (
    <DashboardLayout title="Notifications">
      <PageHeader
        title="Notifications"
        description="Stay updated on invoices, payments, and contracts."
        breadcrumbs={[{ label: "Notifications" }]}
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={markAllRead}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck size={14} /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111827]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
          <NotificationFilter active={filter} onChange={setFilter} unreadCount={unreadCount} />
          <p className="text-xs text-[#A1A1AA]">
            {isLoading ? "Loading..." : `${filtered.length} notification${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {error instanceof Error ? (
          <div className="p-5">
            <p className="text-sm font-semibold text-red-300">
              Failed to load notifications
            </p>
            <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
          </div>
        ) : (
          <NotificationList notifications={filtered} filter={filter} onMarkRead={markRead} />
        )}
      </div>
    </DashboardLayout>
  );
}
