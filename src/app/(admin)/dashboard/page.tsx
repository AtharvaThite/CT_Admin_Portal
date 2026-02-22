import {
  Users,
  Stethoscope,
  CalendarCheck,
  IndianRupee,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Activity,
  Repeat,
  ShoppingBag,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartCard } from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PieChartCard } from "@/components/dashboard/pie-chart-card";
import { RankedListCard } from "@/components/dashboard/ranked-list-card";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { formatCurrencyRupees } from "@/lib/utils";
import { getDashboardMetrics } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your platform metrics"
      />

      {/* Top-level KPIs - always visible */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString("en-IN")}
          change={metrics.userGrowth}
          icon={Users}
        />
        <KPICard
          title="Therapists"
          value={metrics.totalTherapists.toLocaleString("en-IN")}
          icon={Stethoscope}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <KPICard
          title="Total Bookings"
          value={metrics.totalBookings.toLocaleString("en-IN")}
          change={metrics.bookingGrowth}
          icon={CalendarCheck}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <KPICard
          title="Revenue"
          value={formatCurrencyRupees(metrics.totalRevenue)}
          change={metrics.revenueGrowth}
          icon={IndianRupee}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Tabbed sections */}
      <DashboardTabs>
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <ChartCard
              title="Booking Trends"
              data={metrics.bookingTrends}
              type="line"
              color="var(--color-chart-1)"
            />
            <ChartCard
              title="Revenue Over Time"
              data={metrics.revenueTrends}
              type="bar"
              color="var(--color-chart-2)"
              formatAs="currency"
            />
          </div>
          <RecentActivity activities={metrics.recentActivity} />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <KPICard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              icon={CheckCircle}
              iconColor="text-green-600 dark:text-green-400"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <KPICard
              title="Avg Booking Value"
              value={formatCurrencyRupees(metrics.averageBookingValue)}
              icon={TrendingUp}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-100 dark:bg-amber-900/30"
            />
            <KPICard
              title="Active Users (30d)"
              value={metrics.activeUsers.toLocaleString("en-IN")}
              icon={Activity}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <PieChartCard
              title="Bookings by Status"
              data={metrics.bookingsByStatus}
            />
            <PieChartCard
              title="Session Type Distribution"
              data={metrics.sessionTypeDistribution}
            />
          </div>
          <RankedListCard
            title="Popular Time Slots"
            items={metrics.popularTimeSlots}
          />
        </TabsContent>

        {/* Therapists Tab */}
        <TabsContent value="therapists">
          <div className="grid gap-4 lg:grid-cols-2">
            <RankedListCard
              title="Top Therapists by Revenue"
              items={metrics.topTherapistsByRevenue}
              formatAs="currency"
            />
            <RankedListCard
              title="Bookings per Therapist"
              items={metrics.bookingsPerTherapist}
            />
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <KPICard
              title="Onboarding Rate"
              value={`${metrics.onboardingRate}%`}
              icon={UserCheck}
              iconColor="text-green-600 dark:text-green-400"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <KPICard
              title="Active Users (30d)"
              value={metrics.activeUsers.toLocaleString("en-IN")}
              icon={Activity}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <KPICard
              title="Repeat Bookers"
              value={metrics.repeatBookingUsers.toLocaleString("en-IN")}
              icon={Repeat}
              iconColor="text-purple-600 dark:text-purple-400"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>
          <ChartCard
            title="New Users Over Time"
            data={metrics.newUsersTrend}
            type="area"
            color="var(--color-chart-3)"
          />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <KPICard
              title="Total Orders"
              value={metrics.totalOrders.toLocaleString("en-IN")}
              icon={ShoppingBag}
              iconColor="text-purple-600 dark:text-purple-400"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <PieChartCard
              title="Orders by Status"
              data={metrics.ordersByStatus}
            />
            <RankedListCard
              title="Top Selling Products"
              items={metrics.topSellingProducts}
            />
          </div>
        </TabsContent>
      </DashboardTabs>
    </div>
  );
}
