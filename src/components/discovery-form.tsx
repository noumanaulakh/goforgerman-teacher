"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  PROFICIENCY_QUESTIONS,
  REASONS,
  computeLevel,
  recommendedTiers,
  type CefrLevel,
  type ReasonValue,
} from "@/lib/discovery";
import type { Specialization } from "@/lib/types";

export function DiscoveryForm({
  studentId,
  specializations,
}: {
  studentId: string;
  specializations: Specialization[];
}) {
  const [step, setStep] = useState<"reason" | "proficiency" | "result">(
    "reason"
  );
  const [reason, setReason] = useState<ReasonValue | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    level: CefrLevel;
    tiers: number[];
    specs: Specialization[];
  } | null>(null);

  async function finishAssessment() {
    if (!reason) return;
    setSaving(true);

    const reasonMeta = REASONS.find((r) => r.value === reason)!;
    const level = computeLevel(answers);
    const tiers = recommendedTiers(level, reason);
    const matchingSpecs = specializations.filter(
      (s) => s.category === reasonMeta.category
    );

    const supabase = createClient();
    await supabase.from("discovery_responses").insert({
      student_id: studentId,
      reason_for_learning: reason,
      proficiency_answers: answers,
      computed_level: level,
      recommended_specialization_ids: matchingSpecs.map((s) => s.id),
    });

    setResult({ level, tiers, specs: matchingSpecs });
    setSaving(false);
    setStep("result");
  }

  if (step === "result" && result) {
    const params = new URLSearchParams();
    if (result.specs.length > 0) {
      params.set("specialization", result.specs.map((s) => s.name).join(","));
    }
    if (result.tiers.length > 0) {
      params.set("tier", result.tiers.join(","));
    }

    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
          Your estimated level
        </p>
        <p className="font-headline text-4xl font-extrabold text-primary">
          {result.level}
        </p>
        {result.specs.length > 0 && (
          <p className="mt-4 text-sm text-neutral-900/70">
            Recommended focus:{" "}
            {result.specs.map((s) => s.name).join(", ")}
          </p>
        )}
        <Link
          href={`/teachers?${params.toString()}`}
          className="mt-6 inline-block rounded-md bg-secondary px-6 py-3 text-sm font-bold text-primary-dark transition hover:brightness-95"
        >
          View matching teachers
        </Link>
      </div>
    );
  }

  if (step === "proficiency") {
    return (
      <div className="space-y-4 rounded-xl border border-black/10 bg-white p-8">
        <h2 className="font-headline text-lg font-bold text-primary">
          A few quick questions
        </h2>
        <p className="text-sm text-neutral-900/60">
          Answer honestly — this only sets your starting point.
        </p>
        <div className="space-y-3">
          {PROFICIENCY_QUESTIONS.map((q) => (
            <label
              key={q.id}
              className="flex items-start gap-3 rounded-md border border-black/10 p-3 text-sm"
            >
              <input
                type="checkbox"
                className="mt-0.5 accent-primary"
                checked={!!answers[q.id]}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [q.id]: e.target.checked }))
                }
              />
              {q.question}
            </label>
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep("reason")}
            className="rounded-md border border-black/15 px-5 py-2 text-sm font-semibold"
          >
            Back
          </button>
          <button
            type="button"
            onClick={finishAssessment}
            disabled={saving}
            className="rounded-md bg-secondary px-5 py-2 text-sm font-bold text-primary-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "See my results"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-black/10 bg-white p-8">
      <h2 className="font-headline text-lg font-bold text-primary">
        Why are you learning German?
      </h2>
      <div className="space-y-2">
        {REASONS.map((r) => (
          <label
            key={r.value}
            className="flex items-center gap-3 rounded-md border border-black/10 p-3 text-sm"
          >
            <input
              type="radio"
              name="reason"
              className="accent-primary"
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
            />
            {r.label}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setStep("proficiency")}
        disabled={!reason}
        className="w-full rounded-md bg-secondary py-3 text-sm font-bold text-primary-dark disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
