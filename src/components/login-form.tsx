"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-md border border-black/15 px-3 py-2 text-sm";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-black/10 bg-white p-8"
    >
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
          autoComplete="current-password"
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
        {status === "submitting" ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-sm text-neutral-900/60">
        Registering as a teacher?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Apply here
        </Link>
      </p>
    </form>
  );
}
