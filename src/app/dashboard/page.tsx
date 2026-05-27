import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UpcomingInvoices } from "@/components/dashboard/upcoming-invoices";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { NotificationPreview } from "@/components/dashboard/notification-preview";
import { PageHeader } from "@/components/shared/page-header";
import { STAT_CARDS } from "@/constants/mock-data/dashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="page-enter space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back. Here's what's happening today."
        />

        {/* Stat cards — staggered */}
        <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="slide-up">
              <StatCard data={card} />
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="slide-up" style={{ animationDelay: "80ms" }}>
          <RevenueChart />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="slide-up lg:col-span-2" style={{ animationDelay: "120ms" }}>
            <UpcomingInvoices />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="slide-up" style={{ animationDelay: "160ms" }}>
              <RecentActivity />
            </div>
            <div className="slide-up" style={{ animationDelay: "200ms" }}>
              <NotificationPreview />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}