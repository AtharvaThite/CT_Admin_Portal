import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { Review } from '@/lib/types/review';

export async function getAllReviews(): Promise<Review[]> {
  const therapistsSnap = await adminDb.collection(COLLECTIONS.THERAPISTS).get();
  const reviews: Review[] = [];

  therapistsSnap.forEach((doc) => {
    const data = doc.data();
    const therapistReviews = (data.reviews || []) as Review[];
    therapistReviews.forEach((review) => {
      reviews.push(serialize<Review>({
        ...review,
        therapistId: doc.id,
        therapistName: data.name || '',
      }));
    });
  });

  return reviews.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });
}
