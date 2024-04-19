import { Review } from './../domain/review';

export class ReviewsWithRatingCount {
  reviews: Review[];
  ratings: { rating: number; count: number }[];
}
