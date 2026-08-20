import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RatingStars } from "@/components/rating-stars";
import { BookingWidget } from "@/components/booking-widget";
import { formatLabel } from "@/lib/constants";
import type { TeacherProfile } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("teachers")
    .select(
      "*, pricing_plans(*), teacher_teaching_formats(*), teacher_specializations(*, specialization:specializations(*)), teacher_qualifications(*), teacher_availability(*)"
    )
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const teacher = data as unknown as TeacherProfile;
  const sortedPlans = [...teacher.pricing_plans].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const sortedQualifications = [...teacher.teacher_qualifications].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary font-headline text-2xl font-bold text-white">
              {initials(teacher.full_name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-2xl font-bold text-primary">
                  {teacher.full_name}
                </h1>
                {teacher.is_daf_certified && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-primary-dark">
                    ✓
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-900/70">
                {teacher.headline}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {teacher.is_daf_certified && (
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-neutral-900/80">
                    DAF Certified
                  </span>
                )}
                <RatingStars
                  rating={teacher.rating}
                  reviewCount={teacher.review_count}
                />
                {teacher.is_native_speaker && (
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-neutral-900/80">
                    Native Speaker
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {teacher.bio && (
          <section>
            <h2 className="font-headline text-xl font-bold text-primary">
              About Me
            </h2>
            <hr className="my-3 border-black/10" />
            <p className="text-neutral-900/80">{teacher.bio}</p>
          </section>
        )}

        {teacher.teaching_philosophy && (
          <section>
            <h2 className="font-headline text-xl font-bold text-primary">
              Teaching Philosophy
            </h2>
            <hr className="my-3 border-black/10" />
            <p className="text-neutral-900/80">
              {teacher.teaching_philosophy}
            </p>
          </section>
        )}

        {teacher.teacher_specializations.length > 0 && (
          <section>
            <h2 className="font-headline text-xl font-bold text-primary">
              Specializations
            </h2>
            <hr className="my-3 border-black/10" />
            <div className="grid gap-4 sm:grid-cols-2">
              {teacher.teacher_specializations.map((spec) => (
                <div
                  key={spec.id}
                  className="rounded-lg border border-black/10 bg-cream p-4"
                >
                  <h3 className="font-semibold text-primary">
                    {spec.specialization?.name ?? spec.custom_name}
                  </h3>
                  {spec.description && (
                    <p className="mt-1 text-sm text-neutral-900/70">
                      {spec.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {teacher.teacher_teaching_formats.length > 0 && (
          <section>
            <h2 className="font-headline text-xl font-bold text-primary">
              Teaching Formats
            </h2>
            <hr className="my-3 border-black/10" />
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_teaching_formats.map((f) => (
                <span
                  key={f.format}
                  className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-neutral-900/80"
                >
                  {formatLabel(f.format)}
                </span>
              ))}
            </div>
          </section>
        )}

        {sortedQualifications.length > 0 && (
          <section>
            <h2 className="font-headline text-xl font-bold text-primary">
              Qualifications &amp; Certificates
            </h2>
            <hr className="my-3 border-black/10" />
            <ul className="space-y-2">
              {sortedQualifications.map((qual) => (
                <li
                  key={qual.id}
                  className="flex items-start gap-2 text-neutral-900/80"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-primary-dark">
                    ✓
                  </span>
                  {qual.qualification}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="space-y-6">
        {sortedPlans.length > 0 && (
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <h2 className="font-headline text-lg font-bold text-primary">
              Pricing Plans
            </h2>
            <div className="mt-4 space-y-3">
              {sortedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 ${
                    plan.is_popular
                      ? "border-secondary"
                      : "border-black/10"
                  }`}
                >
                  {plan.is_popular && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Popular
                    </span>
                  )}
                  <div className="mt-1 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {plan.course_type}
                      </p>
                      <p className="text-xs text-neutral-900/60">
                        Tier {plan.tier} &middot; {plan.session_length_minutes}{" "}
                        min
                      </p>
                    </div>
                    <p className="font-headline text-xl font-bold text-primary">
                      &euro;{Number(plan.price_amount).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <BookingWidget
          teacherId={teacher.id}
          pricingPlans={sortedPlans}
          availability={teacher.teacher_availability}
          timezone={teacher.timezone}
        />
      </aside>
    </div>
  );
}
