import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { serialize } from "@/lib/firebase/serialize";
import type { KPIData, ChartDataPoint, RecentActivity } from "@/lib/types/dashboard";

function toDateString(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null && '_seconds' in val) {
    return new Date((val as { _seconds: number })._seconds * 1000).toISOString();
  }
  return String(val);
}

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
