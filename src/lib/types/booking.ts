export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed';

export interface Booking {
  id: string;
  userId: string;
  therapistId: string;
  therapistName: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  amount: number;
  discount: number;
  taxRate: number;
  notes: string;
  status: BookingStatus;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  razorpaySignature: string | null;
}
