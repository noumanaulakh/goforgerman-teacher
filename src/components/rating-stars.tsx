export function RatingStars({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span aria-hidden className="text-secondary">
        ★
      </span>
      <span className="font-bold text-neutral-900">{rating.toFixed(1)}</span>
      <span className="text-neutral-900/60">({reviewCount} reviews)</span>
    </div>
  );
}
