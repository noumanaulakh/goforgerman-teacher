import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <div>
          <p className="font-headline text-lg font-bold text-secondary">
            Go for German
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            &copy; {new Date().getFullYear()} Go for German. All rights
            reserved. Precision in language learning.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <Link href="/terms" className="font-semibold text-white/90 hover:text-secondary">
            Terms of Service
          </Link>
          <Link href="/privacy" className="font-semibold text-white/90 hover:text-secondary">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="font-semibold text-white/90 hover:text-secondary">
            Cookie Policy
          </Link>
          <Link href="/contact" className="font-semibold text-white/90 hover:text-secondary">
            Contact Support
          </Link>
          <Link href="/careers" className="font-semibold text-white/90 hover:text-secondary">
            Careers
          </Link>
          <Link href="/affiliate" className="font-semibold text-white/90 hover:text-secondary">
            Affiliate Program
          </Link>
        </div>
      </div>
    </footer>
  );
}
