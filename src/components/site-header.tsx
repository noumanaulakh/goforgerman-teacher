import Link from "next/link";

const NAV_LINKS = [
  { href: "/teachers", label: "Find a Teacher" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/resources", label: "Resources" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-headline text-xl font-bold text-primary"
        >
          Go for German
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-900 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-primary sm:inline"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-secondary px-4 py-2 text-sm font-bold text-primary-dark transition hover:brightness-95"
          >
            Register as Teacher
          </Link>
        </div>
      </div>
    </header>
  );
}
