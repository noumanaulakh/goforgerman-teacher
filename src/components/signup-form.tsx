"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resolvePostLoginRedirect } from "@/lib/auth/post-login-redirect";

const inputClass =
  "w-full rounded-md border border-black/15 px-3 py-2 text-sm";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error" | "check-email"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      const redirectTo = await resolvePostLoginRedirect(supabase);
      router.push(redirectTo);
      router.refresh();
      return;
    }

    // Email confirmation is required before a session exists — the
    // `students` row gets created on first login instead (see
    // resolvePostLoginRedirect).
    setStatus("check-email");
  }

  if (status === "check-email") {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center">
        <p className="font-headline text-lg font-bold text-primary">
          Check your email
        </p>
        <p className="mt-2 text-sm text-neutral-900/70">
          We sent a confirmation link to {email}. Confirm your address, then{" "}
          <Link href="/login" className="font-semibold text-primary">
            log in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-black/10 bg-white p-8"
    >
      <div>
        <label className="text-sm font-semibold text-neutral-900">
          Full name
        </label>
        <input
          required
          autoComplete="name"
          className={`${inputClass} mt-1`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-900">
          Email
        </label>
        <input
          required
          type="email"
          autoComplete="email"
          className={`${inputClass} mt-1`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-900">
          Password
        </label>
        <input
          required
          type="password"
          minLength={6}
          autoComplete="new-password"
          className={`${inputClass} mt-1`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-tertiary">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-secondary py-3 text-sm font-bold text-primary-dark transition hover:brightness-95 disabled:opacity-50"
      >
        {status === "submitting" ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-center text-sm text-neutral-900/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </form>
  );
}
