export type NotificationType =
  | "due_soon"
  | "overdue"
  | "payment_received"
  | "system";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  relatedClientName?: string;
  relatedInvoiceNumber?: string;
}

export interface ApiNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedClient?: {
    _id: string;
    name: string;
  };
  relatedInvoice?: {
    _id: string;
    invoiceNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: ApiNotification[];
    unreadCount: number;
    pagination: NotificationPagination;
  };
}

export interface NotificationDetailResponse {
  success: boolean;
  message: string;
  data: {
    notification: ApiNotification;
  };
}
