const STUDENT_STEPS = [
  {
    title: "Browse curated teachers",
    description:
      "Filter by teaching format, specialization, and price tier to find the right fit.",
  },
  {
    title: "Review a verified profile",
    description:
      "Every teacher passes a basic qualification review before their profile goes live.",
  },
  {
    title: "Book with confidence",
    description:
      "Request a lesson slot directly on the teacher's profile — no charge until confirmed.",
  },
];

const TEACHER_STEPS = [
  {
    title: "Register your profile",
    description:
      "Tell us about your qualifications, teaching formats, and select a price tier.",
  },
  {
    title: "Get reviewed",
    description:
      "Our team checks your CV and proof of qualification, usually within 48 hours.",
  },
  {
    title: "Go live & get booked",
    description:
      "Appear in the directory and get approached for Go for German's own courses too.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-primary">
          How it Works
        </h1>
        <p className="mt-2 text-neutral-900/70">
          Go for German is a curated selection of teachers, not an
          unregulated marketplace.
        </p>
      </div>

      <section>
        <h2 className="font-headline text-xl font-bold text-primary">
          For students
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {STUDENT_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-black/10 bg-white p-6">
              <span className="font-headline text-2xl font-bold text-secondary">
                {i + 1}
              </span>
              <h3 className="mt-2 font-semibold text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-900/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline text-xl font-bold text-primary">
          For teachers
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {TEACHER_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-black/10 bg-white p-6">
              <span className="font-headline text-2xl font-bold text-secondary">
                {i + 1}
              </span>
              <h3 className="mt-2 font-semibold text-primary">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-900/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
