export interface KPIData {
  totalUsers: number;
  totalTherapists: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'signup' | 'order';
  title: string;
  description: string;
  timestamp: string;
}

export interface PieDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface RankedItem {
  name: string;
  value: number;
  secondaryLabel?: string;
}

export interface DashboardMetrics {
  // KPIs
  totalUsers: number;
  totalTherapists: number;
  totalBookings: number;
  totalRevenue: number;
  totalOrders: number;
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  completionRate: number;
  averageBookingValue: number;
  onboardingRate: number;
  activeUsers: number;
  repeatBookingUsers: number;

  // Charts
  bookingTrends: ChartDataPoint[];
  revenueTrends: ChartDataPoint[];
  newUsersTrend: ChartDataPoint[];

  // Pie charts
  bookingsByStatus: PieDataPoint[];
  ordersByStatus: PieDataPoint[];
  sessionTypeDistribution: PieDataPoint[];

  // Ranked lists
  topTherapistsByRevenue: RankedItem[];
  bookingsPerTherapist: RankedItem[];
  topSellingProducts: RankedItem[];
  popularTimeSlots: RankedItem[];

  // Activity
  recentActivity: RecentActivity[];
}
