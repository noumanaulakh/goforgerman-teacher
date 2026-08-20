export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-headline text-3xl font-bold text-primary">
        {title}
      </h1>
      <p className="mt-4 text-neutral-900/70">{description}</p>
    </div>
  );
}
