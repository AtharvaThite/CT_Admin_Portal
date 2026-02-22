import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { serialize } from "@/lib/firebase/serialize";
import type {
  KPIData,
  ChartDataPoint,
  RecentActivity,
  DashboardMetrics,
  PieDataPoint,
  RankedItem,
} from "@/lib/types/dashboard";

function toDateString(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null && '_seconds' in val) {
    return new Date((val as { _seconds: number })._seconds * 1000).toISOString();
  }
  return String(val);
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
  failed: "#6b7280",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  processing: "#3b82f6",
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] || "#94a3b8";
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function computeGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [bookingsSnap, usersSnap, therapistsSnap, ordersSnap, productsSnap] =
    await Promise.all([
      adminDb.collection(COLLECTIONS.BOOKINGS).get(),
      adminDb.collection(COLLECTIONS.USERS).get(),
      adminDb.collection(COLLECTIONS.THERAPISTS).get(),
      adminDb.collection(COLLECTIONS.ORDERS).get(),
      adminDb.collection(COLLECTIONS.PRODUCTS).get(),
    ]);

  const now = new Date();
  const currentMonthKey = getMonthKey(now);
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = getMonthKey(prevMonth);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // --- Bookings processing ---
  let totalRevenue = 0;
  let completedCount = 0;
  let cancelledCount = 0;
  let failedCount = 0;
  const bookingStatusCounts: Record<string, number> = {};
  const sessionTypeCounts: Record<string, number> = {};
  const timeSlotCounts: Record<string, number> = {};
  const therapistBookingCounts: Record<string, number> = {};
  const therapistRevenue: Record<string, number> = {};
  const bookingsByMonth: Record<string, number> = {};
  const revenueByMonth: Record<string, number> = {};
  const activeUserIds = new Set<string>();
  const userBookingCounts: Record<string, number> = {};
  let currentMonthBookings = 0;
  let prevMonthBookings = 0;
  let currentMonthRevenue = 0;
  let prevMonthRevenue = 0;

  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    const status = data.status || "unknown";
    const dateStr = toDateString(data.date);
    const date = new Date(dateStr);
    const monthKey = getMonthKey(date);

    // Status counts
    bookingStatusCounts[status] = (bookingStatusCounts[status] || 0) + 1;

    // Revenue
    if (status === "completed") {
      completedCount++;
      const amount = data.amount || 0;
      totalRevenue += amount;

      // Therapist revenue
      const therapistName = data.therapistName || "Unknown";
      therapistRevenue[therapistName] = (therapistRevenue[therapistName] || 0) + amount;

      // Monthly revenue
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount;

      if (monthKey === currentMonthKey) currentMonthRevenue += amount;
      if (monthKey === prevMonthKey) prevMonthRevenue += amount;
    }

    if (status === "cancelled") cancelledCount++;
    if (status === "failed") failedCount++;

    // Session type
    if (data.sessionType) {
      sessionTypeCounts[data.sessionType] = (sessionTypeCounts[data.sessionType] || 0) + 1;
    }

    // Time slot
    if (data.timeSlot) {
      timeSlotCounts[data.timeSlot] = (timeSlotCounts[data.timeSlot] || 0) + 1;
    }

    // Therapist booking count
    const therapistName = data.therapistName || "Unknown";
    therapistBookingCounts[therapistName] = (therapistBookingCounts[therapistName] || 0) + 1;

    // Monthly booking trends
    if (date >= sixMonthsAgo) {
      bookingsByMonth[monthKey] = (bookingsByMonth[monthKey] || 0) + 1;
    }

    if (monthKey === currentMonthKey) currentMonthBookings++;
    if (monthKey === prevMonthKey) prevMonthBookings++;

    // Active users (last 30 days)
    if (data.userId && date >= thirtyDaysAgo) {
      activeUserIds.add(data.userId);
    }

    // User booking counts (for repeat bookers)
    if (data.userId) {
      userBookingCounts[data.userId] = (userBookingCounts[data.userId] || 0) + 1;
    }
  });

  // --- Users processing ---
  let onboardingCompletedCount = 0;
  const usersByMonth: Record<string, number> = {};
  let currentMonthUsers = 0;
  let prevMonthUsers = 0;

  const activities: RecentActivity[] = [];

  usersSnap.forEach((doc) => {
    const data = doc.data();

    if (data.onboardingCompleted) onboardingCompletedCount++;

    const createdStr = toDateString(data.createdAt);
    const createdDate = new Date(createdStr);
    const monthKey = getMonthKey(createdDate);

    if (createdDate >= sixMonthsAgo) {
      usersByMonth[monthKey] = (usersByMonth[monthKey] || 0) + 1;
    }

    if (monthKey === currentMonthKey) currentMonthUsers++;
    if (monthKey === prevMonthKey) prevMonthUsers++;

    activities.push({
      id: doc.id,
      type: "signup",
      title: `New user: ${data.firstName || ""} ${data.lastName || ""}`.trim(),
      description: data.email || "",
      timestamp: createdStr,
    });
  });

  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    activities.push({
      id: doc.id,
      type: "booking",
      title: `New booking with ${data.therapistName || "Therapist"}`,
      description: `${data.sessionType || "Session"} - ${data.status}`,
      timestamp: toDateString(data.date),
    });
  });

  // --- Orders processing ---
  const orderStatusCounts: Record<string, number> = {};
  const productQuantities: Record<string, number> = {};

  ordersSnap.forEach((doc) => {
    const data = doc.data();
    const status = data.status || "unknown";
    orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;

    // Flatten order items
    const items = data.items || [];
    for (const item of items) {
      const name = item.productName || item.name || "Unknown Product";
      const qty = item.quantity || 1;
      productQuantities[name] = (productQuantities[name] || 0) + qty;
    }

    activities.push({
      id: doc.id,
      type: "order",
      title: `New order #${doc.id.slice(0, 8)}`,
      description: `${status} - ${items.length} item(s)`,
      timestamp: toDateString(data.createdAt),
    });
  });

  // --- Compute derived metrics ---
  const totalUsers = usersSnap.size;
  const totalTherapists = therapistsSnap.size;
  const totalBookings = bookingsSnap.size;
  const totalOrders = ordersSnap.size;

  const denominator = completedCount + cancelledCount + failedCount;
  const completionRate = denominator > 0
    ? Math.round((completedCount / denominator) * 100)
    : 0;

  const averageBookingValue = completedCount > 0
    ? Math.round(totalRevenue / completedCount)
    : 0;

  const onboardingRate = totalUsers > 0
    ? Math.round((onboardingCompletedCount / totalUsers) * 100)
    : 0;

  const repeatBookingUsers = Object.values(userBookingCounts).filter((c) => c > 1).length;

  // --- Build chart data ---
  const bookingTrends: ChartDataPoint[] = Object.entries(bookingsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  const revenueTrends: ChartDataPoint[] = Object.entries(revenueByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  const newUsersTrend: ChartDataPoint[] = Object.entries(usersByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  // --- Pie chart data ---
  const bookingsByStatus: PieDataPoint[] = Object.entries(bookingStatusCounts)
    .map(([label, value]) => ({ label, value, color: getStatusColor(label) }));

  const ordersByStatus: PieDataPoint[] = Object.entries(orderStatusCounts)
    .map(([label, value]) => ({ label, value, color: getStatusColor(label) }));

  const sessionTypeColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const sessionTypeDistribution: PieDataPoint[] = Object.entries(sessionTypeCounts)
    .map(([label, value], i) => ({
      label,
      value,
      color: sessionTypeColors[i % sessionTypeColors.length],
    }));

  // --- Ranked lists ---
  const topTherapistsByRevenue: RankedItem[] = Object.entries(therapistRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const bookingsPerTherapist: RankedItem[] = Object.entries(therapistBookingCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const topSellingProducts: RankedItem[] = Object.entries(productQuantities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const popularTimeSlots: RankedItem[] = Object.entries(timeSlotCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // --- Growth ---
  const userGrowth = computeGrowth(currentMonthUsers, prevMonthUsers);
  const bookingGrowth = computeGrowth(currentMonthBookings, prevMonthBookings);
  const revenueGrowth = computeGrowth(currentMonthRevenue, prevMonthRevenue);

  // --- Recent activity ---
  const recentActivity = serialize<RecentActivity[]>(
    activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  );

  return {
    totalUsers,
    totalTherapists,
    totalBookings,
    totalRevenue,
    totalOrders,
    userGrowth,
    bookingGrowth,
    revenueGrowth,
    completionRate,
    averageBookingValue,
    onboardingRate,
    activeUsers: activeUserIds.size,
    repeatBookingUsers,
    bookingTrends,
    revenueTrends,
    newUsersTrend,
    bookingsByStatus,
    ordersByStatus,
    sessionTypeDistribution,
    topTherapistsByRevenue,
    bookingsPerTherapist,
    topSellingProducts,
    popularTimeSlots,
    recentActivity,
  };
}

// --- Legacy functions kept for backward compatibility ---

export async function getKPIData(): Promise<KPIData> {
  const [usersSnap, therapistsSnap, bookingsSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.USERS).count().get(),
    adminDb.collection(COLLECTIONS.THERAPISTS).count().get(),
    adminDb.collection(COLLECTIONS.BOOKINGS).count().get(),
  ]);

  const bookingsDocs = await adminDb.collection(COLLECTIONS.BOOKINGS).get();
  let totalRevenue = 0;
  bookingsDocs.forEach((doc) => {
    const data = doc.data();
    if (data.status === "completed") {
      totalRevenue += data.amount || 0;
    }
  });

  return {
    totalUsers: usersSnap.data().count,
    totalTherapists: therapistsSnap.data().count,
    totalBookings: bookingsSnap.data().count,
    totalRevenue,
    userGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
  };
}

export async function getBookingTrends(): Promise<ChartDataPoint[]> {
  const bookingsSnap = await adminDb.collection(COLLECTIONS.BOOKINGS).get();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData: Record<string, number> = {};
  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    const dateStr = toDateString(data.date);
    const date = new Date(dateStr);
    if (date >= sixMonthsAgo) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export async function getRevenueOverTime(): Promise<ChartDataPoint[]> {
  const bookingsSnap = await adminDb.collection(COLLECTIONS.BOOKINGS).get();

  const monthlyData: Record<string, number> = {};
  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.status === "completed") {
      const dateStr = toDateString(data.date);
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[key] = (monthlyData[key] || 0) + (data.amount || 0);
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const [bookingsSnap, usersSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.BOOKINGS).get(),
    adminDb.collection(COLLECTIONS.USERS).get(),
  ]);

  const activities: RecentActivity[] = [];

  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    activities.push({
      id: doc.id,
      type: "booking",
      title: `New booking with ${data.therapistName || "Therapist"}`,
      description: `${data.sessionType || "Session"} - ${data.status}`,
      timestamp: toDateString(data.date),
    });
  });

  usersSnap.forEach((doc) => {
    const data = doc.data();
    activities.push({
      id: doc.id,
      type: "signup",
      title: `New user: ${data.firstName || ""} ${data.lastName || ""}`.trim(),
      description: data.email || "",
      timestamp: toDateString(data.createdAt),
    });
  });

  return serialize(
    activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  );
}
