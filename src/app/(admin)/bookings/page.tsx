import { PageHeader } from "@/components/shared/page-header";
import { getBookings } from "@/lib/queries/bookings";
import { BookingsClient } from "./bookings-client";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="View and manage therapy session bookings"
      />
      <BookingsClient bookings={bookings} />
    </div>
  );
}
