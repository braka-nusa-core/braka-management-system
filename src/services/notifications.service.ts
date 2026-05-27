import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiNotification,
  Notification,
  NotificationDetailResponse,
  NotificationPagination,
  NotificationsResponse,
} from "@/types/notification";

function mapNotification(notification: ApiNotification): Notification {
  return {
    id: notification._id,
    title: notification.title,
    description: notification.message,
    type: notification.type,
    read: notification.isRead,
    timestamp: notification.createdAt,
    relatedClientName: notification.relatedClient?.name,
    relatedInvoiceNumber: notification.relatedInvoice?.invoiceNumber,
  };
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message;

    return responseMessage ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getNotifications() {
  try {
    const response = await apiClient.get<NotificationsResponse>("/notifications");
    return {
      notifications: response.data.data.notifications.map(mapNotification),
      unreadCount: response.data.data.unreadCount,
      pagination: response.data.data.pagination satisfies NotificationPagination,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch notifications"));
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const response = await apiClient.patch<NotificationDetailResponse>(
      `/notifications/${id}/read`
    );
    return mapNotification(response.data.data.notification);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to mark notification as read")
    );
  }
}

export async function markAllNotificationsAsRead() {
  try {
    await apiClient.patch("/notifications/read-all");
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to mark all notifications as read")
    );
  }
}
