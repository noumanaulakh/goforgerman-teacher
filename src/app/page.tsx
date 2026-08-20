import Link from "next/link";

const CUSTOMER_USE_CASES = [
  {
    title: "Learn from scratch",
    description:
      "Start your German journey directly with a curated Go for German teacher, from A1 upward.",
  },
  {
    title: "Add speaking practice",
    description:
      "Supplement a course you're already taking elsewhere with focused, one-on-one speaking training.",
  },
  {
    title: "Subject-specific prep",
    description:
      "Medical, nursing, business, or exam-focused German with a specialist in your field.",
  },
];

const TEACHER_BENEFITS = [
  {
    title: "Reach & visibility",
    description:
      "Benefit from Go for German's existing website traffic and growing Instagram audience, instead of marketing yourself alone.",
  },
  {
    title: "Teach our own courses",
    description:
      "Get approached for co-teaching in our online group courses, GO! 15 speaking trainings, and oral exam-prep formats.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="font-headline text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            Master German with Curated Experts
          </h1>
          <p className="mt-6 max-w-md text-lg text-neutral-900/80">
            Elevate your language proficiency. Connect with top-tier, verified
            German educators tailored to your professional and academic
            goals.
          </p>
          <Link
            href="/teachers"
            className="mt-8 inline-block rounded-md bg-secondary px-6 py-3 font-bold text-primary-dark transition hover:brightness-95"
          >
            Find your Teacher
          </Link>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-neutral-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center text-white">
            <span className="font-headline text-2xl font-bold text-secondary">
              Go for German
            </span>
            <p className="text-sm text-white/80">
              Verified teachers. Transparent pricing. Real results.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-headline text-2xl font-bold text-primary">
            Not an unregulated marketplace
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-900/70">
            Every teacher on Go for German passes a basic qualification
            review before their profile goes live — so you get a curated
            selection, not an open free-for-all.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {CUSTOMER_USE_CASES.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-black/10 bg-cream p-6"
              >
                <h3 className="font-headline text-lg font-bold text-primary">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-900/70">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-headline text-2xl font-bold text-secondary">
            Teach with us
          </h2>
          <p className="mt-2 max-w-2xl text-white/80">
            Registered teachers get more than a booking page — they join a
            pool Go for German draws from for its own course offerings.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TEACHER_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-white/15 bg-white/5 p-6"
              >
                <h3 className="font-headline text-lg font-bold text-secondary">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/register"
            className="mt-10 inline-block rounded-md bg-secondary px-6 py-3 font-bold text-primary-dark transition hover:brightness-95"
          >
            Register as Teacher
          </Link>
        </div>
      </section>
    </>
  );
}
