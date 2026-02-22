export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  helpfulCount: number;
  therapistId?: string;
  therapistName?: string;
  flagged?: boolean;
}
