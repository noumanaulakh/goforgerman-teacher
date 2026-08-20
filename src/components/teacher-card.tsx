import Link from "next/link";
import { RatingStars } from "@/components/rating-stars";
import type { PriceTierDefinition, TeacherListItem } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeacherCard({
  teacher,
  tiers,
}: {
  teacher: TeacherListItem;
  tiers: PriceTierDefinition[];
}) {
  const featuredPlan =
    teacher.pricing_plans.find((plan) => plan.is_popular) ??
    [...teacher.pricing_plans].sort((a, b) => b.tier - a.tier)[0];

  const tierDefinition = featuredPlan
    ? tiers.find((tier) => tier.tier === featuredPlan.tier)
    : undefined;

  const tags = teacher.teacher_specializations
    .map((spec) => spec.specialization?.name ?? spec.custom_name)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-headline text-lg font-bold text-white">
          {initials(teacher.full_name)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-headline text-lg font-bold text-primary">
              {teacher.full_name}
            </h3>
            {teacher.is_daf_certified && (
              <span
                title="Verified by Go for German"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white"
              >
                ✓
              </span>
            )}
          </div>
          <RatingStars rating={teacher.rating} reviewCount={teacher.review_count} />
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm text-neutral-900/80">
        {teacher.headline}
      </p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-neutral-900/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-end justify-between border-t border-black/10 pt-4">
        <div>
          {tierDefinition && (
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              {tierDefinition.name} tier
            </p>
          )}
          {featuredPlan && (
            <p className="font-headline text-2xl font-bold text-primary">
              &euro;{Number(featuredPlan.price_amount).toFixed(0)}
              <span className="text-sm font-medium text-neutral-900/60">
                /hr
              </span>
            </p>
          )}
        </div>
        <Link
          href={`/teachers/${teacher.id}`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
