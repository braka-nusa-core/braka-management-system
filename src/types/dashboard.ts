export type DashboardActivityType =
  | "invoice_paid"
  | "invoice_created"
  | "client_created"
  | "maintenance_created";

export interface ApiDashboardUpcomingInvoice {
  _id: string;
  invoiceNumber: string;
  dueDate: string;
  total: number;
  client: {
    _id: string;
    name: string;
  };
}

export interface ApiDashboardActivity {
  type: DashboardActivityType;
  description: string;
  meta?: string;
  timestamp: string;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalClients: number;
    activeMaintenance: number;
    pendingInvoices: number;
    overdueInvoices: number;
    monthlyRevenue: number;
    upcomingDueInvoices: ApiDashboardUpcomingInvoice[];
    recentActivity: ApiDashboardActivity[];
  };
}

export interface DashboardUpcomingInvoice {
  id: string;
  invoiceNumber: string;
  dueDate: string;
  total: number;
  clientId: string;
  clientName: string;
}

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  description: string;
  meta?: string;
  timestamp: string;
}

export interface DashboardSummary {
  totalClients: number;
  activeMaintenance: number;
  pendingInvoices: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  upcomingDueInvoices: DashboardUpcomingInvoice[];
  recentActivity: DashboardActivity[];
}

export interface DashboardStatCardData {
  label: string;
  value: string;
  icon: "Users" | "Wrench" | "FileText" | "AlertCircle" | "TrendingUp";
  description?: string;
  pill?: string;
  pillTone?: "positive" | "negative" | "neutral";
}
