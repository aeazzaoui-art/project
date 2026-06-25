import { Sitter, Review } from '../types';

export function getSitterRatingAndCount(sitter: Sitter, reviews: Review[]) {
  const sitterReviews = reviews.filter(r => r.sitterId === sitter.id);
  if (sitterReviews.length === 0) {
    return { rating: 0, reviewCount: 0 };
  }
  const sum = sitterReviews.reduce((acc, r) => acc + r.rating, 0);
  const rating = parseFloat((sum / sitterReviews.length).toFixed(1));
  return { rating, reviewCount: sitterReviews.length };
}
