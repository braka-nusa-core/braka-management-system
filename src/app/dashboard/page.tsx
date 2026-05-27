"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationPreview } from "@/components/dashboard/notification-preview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingInvoices } from "@/components/dashboard/upcoming-invoices";
import { PageHeader } from "@/components/shared/page-header";
import { StatCardSkeletonGrid } from "@/components/skeletons/stat-card-skeleton";
import { getDashboardSummary, getNotifications } from "@/services";
import type { DashboardStatCardData } from "@/types/dashboard";

function formatCompactRupiah(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const statCards: DashboardStatCardData[] = summary
    ? [
        {
          label: "Total Clients",
          value: summary.totalClients.toLocaleString("id-ID"),
          description: "Registered clients in your workspace",
          icon: "Users",
        },
        {
          label: "Active Maintenance",
          value: summary.activeMaintenance.toLocaleString("id-ID"),
          description: "Ongoing maintenance contracts",
          icon: "Wrench",
        },
        {
          label: "Pending Invoices",
          value: summary.pendingInvoices.toLocaleString("id-ID"),
          description: "Invoices awaiting payment",
          icon: "FileText",
          pill: summary.pendingInvoices > 0 ? "Needs review" : "Clear",
          pillTone: summary.pendingInvoices > 0 ? "neutral" : "positive",
        },
        {
          label: "Overdue Invoices",
          value: summary.overdueInvoices.toLocaleString("id-ID"),
          description: "Invoices needing follow-up",
          icon: "AlertCircle",
          pill: summary.overdueInvoices > 0 ? "Urgent" : "Healthy",
          pillTone: summary.overdueInvoices > 0 ? "negative" : "positive",
        },
        {
          label: "Monthly Revenue",
          value: formatCompactRupiah(summary.monthlyRevenue),
          description: "Paid invoices in the current month",
          icon: "TrendingUp",
        },
      ]
    : [];

  const summaryErrorMessage =
    summaryError instanceof Error ? summaryError.message : undefined;
  const notificationsErrorMessage =
    notificationsError instanceof Error ? notificationsError.message : undefined;

  return (
    <DashboardLayout title="Dashboard">
      <div className="page-enter space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back. Here's what's happening today."
        />

        {isSummaryLoading ? (
          <StatCardSkeletonGrid />
        ) : summaryErrorMessage ? (
          <div className="rounded-xl border border-red-400/20 bg-red-500/5 px-5 py-4 text-sm text-red-200">
            Failed to load dashboard summary: {summaryErrorMessage}
          </div>
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card) => (
              <div key={card.label} className="slide-up">
                <StatCard data={card} />
              </div>
            ))}
          </div>
        )}

        <div className="slide-up" style={{ animationDelay: "80ms" }}>
          <RevenueChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div
            className="slide-up lg:col-span-2"
            style={{ animationDelay: "120ms" }}
          >
            <UpcomingInvoices
              invoices={summary?.upcomingDueInvoices ?? []}
              isLoading={isSummaryLoading}
              errorMessage={summaryErrorMessage}
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="slide-up" style={{ animationDelay: "160ms" }}>
              <RecentActivity
                activities={summary?.recentActivity ?? []}
                isLoading={isSummaryLoading}
                errorMessage={summaryErrorMessage}
              />
            </div>
            <div className="slide-up" style={{ animationDelay: "200ms" }}>
              <NotificationPreview
                notifications={notificationsData?.notifications ?? []}
                unreadCount={notificationsData?.unreadCount ?? 0}
                isLoading={isNotificationsLoading}
                errorMessage={notificationsErrorMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
