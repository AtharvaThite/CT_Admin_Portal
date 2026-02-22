import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, IndianRupee, CreditCard, User, Stethoscope } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getBookingById } from "@/lib/queries/bookings";
import { formatDate, formatCurrencyRupees } from "@/lib/utils";
import { BookingStatusActions } from "./booking-status-actions";

export default async function BookingDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);

  if (!booking) return notFound();

  const subtotal = booking.amount;
  const discount = booking.discount;
  const tax = (subtotal - discount) * booking.taxRate;
  const total = subtotal - discount + tax;

  return (
    <div>
      <div className="mb-4">
        <BackButton fallbackHref="/bookings" label="Back to Bookings" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{booking.id}</code>
          </p>
        </div>
        <BookingStatusActions bookingId={bookingId} currentStatus={booking.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm">{formatDate(booking.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Time Slot</p>
                <p className="text-sm">{booking.timeSlot}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Session Type</p>
              <p className="text-sm">{booking.sessionType}</p>
            </div>
            {booking.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Patient ID</p>
                <Link href={`/users/${booking.userId}`} className="text-sm text-primary hover:underline">
                  {booking.userId}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Therapist</p>
                <Link href={`/therapists/${booking.therapistId}`} className="text-sm text-primary hover:underline">
                  {booking.therapistName}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrencyRupees(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-{formatCurrencyRupees(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({(booking.taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrencyRupees(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrencyRupees(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Payment ID:</span>{" "}
              {booking.razorpayPaymentId ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{booking.razorpayPaymentId}</code>
              ) : "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Order ID:</span>{" "}
              {booking.razorpayOrderId ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{booking.razorpayOrderId}</code>
              ) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
