import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type {
  ApiDashboardActivity,
  ApiDashboardUpcomingInvoice,
  DashboardActivity,
  DashboardSummary,
  DashboardSummaryResponse,
  DashboardUpcomingInvoice,
} from "@/types/dashboard";

function mapUpcomingInvoice(
  invoice: ApiDashboardUpcomingInvoice
): DashboardUpcomingInvoice {
  return {
    id: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    dueDate: invoice.dueDate,
    total: invoice.total,
    clientId: invoice.client._id,
    clientName: invoice.client.name,
  };
}

function mapActivity(
  activity: ApiDashboardActivity,
  index: number
): DashboardActivity {
  return {
    id: `${activity.type}-${activity.timestamp}-${index}`,
    type: activity.type,
    description: activity.description,
    meta: activity.meta,
    timestamp: activity.timestamp,
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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response =
      await apiClient.get<DashboardSummaryResponse>("/dashboard/summary");
    const data = response.data.data;

    return {
      totalClients: data.totalClients,
      activeMaintenance: data.activeMaintenance,
      pendingInvoices: data.pendingInvoices,
      overdueInvoices: data.overdueInvoices,
      monthlyRevenue: data.monthlyRevenue,
      upcomingDueInvoices: data.upcomingDueInvoices.map(mapUpcomingInvoice),
      recentActivity: data.recentActivity.map(mapActivity),
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch dashboard summary")
    );
  }
}
