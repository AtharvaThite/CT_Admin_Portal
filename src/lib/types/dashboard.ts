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
