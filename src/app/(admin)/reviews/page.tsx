import { PageHeader } from "@/components/shared/page-header";
import { getAllReviews } from "@/lib/queries/reviews";
import { ReviewsClient } from "./reviews-client";

export default async function ReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Moderate therapist reviews"
      />
      <ReviewsClient reviews={reviews} />
    </div>
  );
}
