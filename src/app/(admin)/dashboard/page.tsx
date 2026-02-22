import { Users, Stethoscope, CalendarCheck, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartCard } from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { formatCurrencyRupees } from "@/lib/utils";
import {
  getKPIData,
  getBookingTrends,
  getRevenueOverTime,
  getRecentActivity,
} from "@/lib/queries/dashboard";
export default async function DashboardPage() {
  const [kpis, bookingTrends, revenueTrends, recentActivity] = await Promise.all([
    getKPIData(),
    getBookingTrends(),
    getRevenueOverTime(),
    getRecentActivity(),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your platform metrics"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Total Users"
          value={kpis.totalUsers.toLocaleString("en-IN")}
          change={kpis.userGrowth}
          icon={Users}
        />
        <KPICard
          title="Therapists"
          value={kpis.totalTherapists.toLocaleString("en-IN")}
          icon={Stethoscope}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <KPICard
          title="Total Bookings"
          value={kpis.totalBookings.toLocaleString("en-IN")}
          change={kpis.bookingGrowth}
          icon={CalendarCheck}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <KPICard
          title="Revenue"
          value={formatCurrencyRupees(kpis.totalRevenue)}
          change={kpis.revenueGrowth}
          icon={IndianRupee}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <ChartCard
          title="Booking Trends"
          data={bookingTrends}
          type="line"
          color="var(--color-chart-1)"
        />
        <ChartCard
          title="Revenue Over Time"
          data={revenueTrends}
          type="bar"
          color="var(--color-chart-2)"
          formatAs="currency"
        />
      </div>

      <RecentActivity activities={recentActivity} />
    </div>
  );
}
