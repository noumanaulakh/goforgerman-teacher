"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TEACHING_FORMATS } from "@/lib/constants";
import type { PriceTierDefinition, Specialization } from "@/lib/types";

const STEPS = ["Basic Info", "Qualifications", "Formats & Pricing", "Review"];

type PricingRow = {
  key: string;
  courseType: string;
  tier: number;
  price: string;
  sessionLength: number;
  isPopular: boolean;
};

type SpecRow = {
  key: string;
  specializationId: string | null;
  customName: string;
  description: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  timezone: string;
  headline: string;
  isNativeSpeaker: boolean;
  isDafCertified: boolean;
  bio: string;
  philosophy: string;
  qualifications: string[];
  specs: SpecRow[];
  formats: Record<string, boolean>;
  formatDescriptions: Record<string, string>;
  pricingPlans: PricingRow[];
  headshotFile: File | null;
  cvFile: File | null;
};

function newKey() {
  return Math.random().toString(36).slice(2);
}

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  timezone: "Europe/Berlin",
  headline: "",
  isNativeSpeaker: false,
  isDafCertified: false,
  bio: "",
  philosophy: "",
  qualifications: [""],
  specs: [],
  formats: {},
  formatDescriptions: {},
  pricingPlans: [],
  headshotFile: null,
  cvFile: null,
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-900">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 px-3 py-2 text-sm";

export function RegisterWizard({
  tiers,
  specializations,
}: {
  tiers: PriceTierDefinition[];
  specializations: Specialization[];
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canProceed() {
    if (step === 0) return form.fullName.trim() && form.email.trim();
    if (step === 2)
      return Object.values(form.formats).some(Boolean) &&
        form.pricingPlans.length > 0;
    return true;
  }

  async function handleSubmit() {
    setStatus("submitting");
    setErrorMessage("");
    const supabase = createClient();

    try {
      let photoUrl: string | null = null;
      let cvUrl: string | null = null;
      const prefix = newKey();

      if (form.headshotFile) {
        const path = `${prefix}/${form.headshotFile.name}`;
        const { error } = await supabase.storage
          .from("teacher-headshots")
          .upload(path, form.headshotFile);
        if (error) throw error;
        photoUrl = supabase.storage.from("teacher-headshots").getPublicUrl(path)
          .data.publicUrl;
      }

      if (form.cvFile) {
        const path = `${prefix}/${form.cvFile.name}`;
        const { error } = await supabase.storage
          .from("teacher-documents")
          .upload(path, form.cvFile);
        if (error) throw error;
        cvUrl = path;
      }

      const payload = {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        headline: form.headline || null,
        photo_url: photoUrl,
        bio: form.bio || null,
        teaching_philosophy: form.philosophy || null,
        is_native_speaker: form.isNativeSpeaker,
        is_daf_certified: form.isDafCertified,
        cv_url: cvUrl,
        timezone: form.timezone,
        teaching_formats: Object.entries(form.formats)
          .filter(([, checked]) => checked)
          .map(([format]) => ({
            format,
            custom_description: form.formatDescriptions[format] || null,
          })),
        specializations: form.specs
          .filter((s) => s.specializationId || s.customName.trim())
          .map((s) => ({
            specialization_id: s.specializationId,
            custom_name: s.specializationId ? null : s.customName,
            description: s.description || null,
          })),
        qualifications: form.qualifications
          .filter((q) => q.trim())
          .map((q, i) => ({ qualification: q, sort_order: i })),
        pricing_plans: form.pricingPlans.map((p, i) => ({
          course_type: p.courseType,
          tier: p.tier,
          price_amount: Number(p.price),
          session_length_minutes: p.sessionLength,
          is_popular: p.isPopular,
          sort_order: i,
        })),
      };

      const { error } = await supabase.rpc("submit_teacher_application", {
        payload,
      });
      if (error) throw error;

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-10 text-center">
        <h2 className="font-headline text-2xl font-bold text-primary">
          Application submitted!
        </h2>
        <p className="mt-2 text-neutral-900/70">
          Our team will review your profile and get back to you within 48
          hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex items-center gap-2 text-xs font-semibold">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                i < step
                  ? "bg-primary text-white"
                  : i === step
                    ? "border-2 border-primary text-primary"
                    : "border border-black/20 text-neutral-900/40"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span
              className={i <= step ? "text-primary" : "text-neutral-900/40"}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px flex-1 bg-black/10" />
            )}
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-black/10 bg-white p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name">
              <input
                className={inputClass}
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Headline (short summary shown on your card)">
              <input
                className={inputClass}
                placeholder="e.g. Certified DAF instructor specializing in Medical German"
                value={form.headline}
                onChange={(e) => update("headline", e.target.value)}
              />
            </Field>
            <Field label="Timezone">
              <input
                className={inputClass}
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              />
            </Field>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isNativeSpeaker}
                  onChange={(e) =>
                    update("isNativeSpeaker", e.target.checked)
                  }
                  className="accent-primary"
                />
                Native speaker
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDafCertified}
                  onChange={(e) => update("isDafCertified", e.target.checked)}
                  className="accent-primary"
                />
                DAF / GFL certified
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <Field label="Professional introduction / About me">
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Guten Tag! I specialize in helping professionals prepare for the Goethe B2 exam..."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </Field>
            <Field label="Teaching philosophy">
              <textarea
                rows={3}
                className={inputClass}
                value={form.philosophy}
                onChange={(e) => update("philosophy", e.target.value)}
              />
            </Field>

            <div>
              <span className="text-sm font-semibold text-neutral-900">
                Qualifications &amp; certificates
              </span>
              <div className="mt-2 space-y-2">
                {form.qualifications.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder="e.g. Goethe-Institut DAF Certification"
                      value={q}
                      onChange={(e) => {
                        const next = [...form.qualifications];
                        next[i] = e.target.value;
                        update("qualifications", next);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "qualifications",
                          form.qualifications.filter((_, idx) => idx !== i)
                        )
                      }
                      className="rounded-md border border-black/15 px-3 text-sm text-tertiary"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update("qualifications", [...form.qualifications, ""])
                  }
                  className="text-sm font-semibold text-primary"
                >
                  + Add qualification
                </button>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-neutral-900">
                Specializations
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {specializations.map((spec) => {
                  const checked = form.specs.some(
                    (s) => s.specializationId === spec.id
                  );
                  return (
                    <label
                      key={spec.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={checked}
                        onChange={() => {
                          update(
                            "specs",
                            checked
                              ? form.specs.filter(
                                  (s) => s.specializationId !== spec.id
                                )
                              : [
                                  ...form.specs,
                                  {
                                    key: newKey(),
                                    specializationId: spec.id,
                                    customName: "",
                                    description: "",
                                  },
                                ]
                          );
                        }}
                      />
                      {spec.name}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 space-y-2">
                {form.specs
                  .filter((s) => !s.specializationId)
                  .map((s) => (
                    <div key={s.key} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder="Custom specialization, e.g. Legal German"
                        value={s.customName}
                        onChange={(e) =>
                          update(
                            "specs",
                            form.specs.map((row) =>
                              row.key === s.key
                                ? { ...row, customName: e.target.value }
                                : row
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "specs",
                            form.specs.filter((row) => row.key !== s.key)
                          )
                        }
                        className="rounded-md border border-black/15 px-3 text-sm text-tertiary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() =>
                    update("specs", [
                      ...form.specs,
                      {
                        key: newKey(),
                        specializationId: null,
                        customName: "",
                        description: "",
                      },
                    ])
                  }
                  className="text-sm font-semibold text-primary"
                >
                  + Add custom specialization
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Headshot (JPG/PNG, max 5MB)">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    update("headshotFile", e.target.files?.[0] ?? null)
                  }
                  className="text-sm"
                />
              </Field>
              <Field label="CV &amp; diplomas (PDF, max 10MB)">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    update("cvFile", e.target.files?.[0] ?? null)
                  }
                  className="text-sm"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-neutral-900">
                Teaching formats offered
              </span>
              <div className="mt-2 space-y-2">
                {TEACHING_FORMATS.map((f) => (
                  <div key={f.value}>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={!!form.formats[f.value]}
                        onChange={(e) =>
                          update("formats", {
                            ...form.formats,
                            [f.value]: e.target.checked,
                          })
                        }
                      />
                      {f.label}
                    </label>
                    {f.value === "subject_specific" &&
                      form.formats[f.value] && (
                        <input
                          className={`${inputClass} mt-2`}
                          placeholder="e.g. Medical German exam preparation, Nursing German"
                          value={form.formatDescriptions[f.value] ?? ""}
                          onChange={(e) =>
                            update("formatDescriptions", {
                              ...form.formatDescriptions,
                              [f.value]: e.target.value,
                            })
                          }
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-secondary/50 bg-secondary/10 p-4 text-sm text-neutral-900/80">
              <p className="font-semibold text-primary">
                How to choose a price tier
              </p>
              <p className="mt-1">
                Experienced teachers with a broader subject range typically
                select a higher tier; teachers early in their career select a
                lower one. You can also mix tiers across course types &mdash;
                e.g. a lower tier for General German and a higher tier for
                specialized exam prep or subject-specific courses.
              </p>
            </div>

            <div>
              <span className="text-sm font-semibold text-neutral-900">
                Pricing plans
              </span>
              <div className="mt-2 space-y-3">
                {form.pricingPlans.map((plan) => (
                  <div
                    key={plan.key}
                    className="grid grid-cols-[1fr_1fr_100px_110px_auto] items-end gap-2 rounded-lg border border-black/10 p-3"
                  >
                    <Field label="Course type">
                      <input
                        className={inputClass}
                        placeholder="General German"
                        value={plan.courseType}
                        onChange={(e) =>
                          update(
                            "pricingPlans",
                            form.pricingPlans.map((row) =>
                              row.key === plan.key
                                ? { ...row, courseType: e.target.value }
                                : row
                            )
                          )
                        }
                      />
                    </Field>
                    <Field label="Tier">
                      <select
                        className={inputClass}
                        value={plan.tier}
                        onChange={(e) =>
                          update(
                            "pricingPlans",
                            form.pricingPlans.map((row) =>
                              row.key === plan.key
                                ? { ...row, tier: Number(e.target.value) }
                                : row
                            )
                          )
                        }
                      >
                        {tiers.map((t) => (
                          <option key={t.tier} value={t.tier}>
                            Tier {t.tier}: {t.name} (&euro;{t.min_rate}
                            {t.max_rate ? `–${t.max_rate}` : "+"})
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Price (&euro;/hr)">
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={plan.price}
                        onChange={(e) =>
                          update(
                            "pricingPlans",
                            form.pricingPlans.map((row) =>
                              row.key === plan.key
                                ? { ...row, price: e.target.value }
                                : row
                            )
                          )
                        }
                      />
                    </Field>
                    <Field label="Session (min)">
                      <select
                        className={inputClass}
                        value={plan.sessionLength}
                        onChange={(e) =>
                          update(
                            "pricingPlans",
                            form.pricingPlans.map((row) =>
                              row.key === plan.key
                                ? {
                                    ...row,
                                    sessionLength: Number(e.target.value),
                                  }
                                : row
                            )
                          )
                        }
                      >
                        {[30, 45, 60, 90].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "pricingPlans",
                          form.pricingPlans.filter((row) => row.key !== plan.key)
                        )
                      }
                      className="rounded-md border border-black/15 px-3 py-2 text-sm text-tertiary"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update("pricingPlans", [
                      ...form.pricingPlans,
                      {
                        key: newKey(),
                        courseType: "",
                        tier: tiers[0]?.tier ?? 1,
                        price: "",
                        sessionLength: 45,
                        isPopular: form.pricingPlans.length === 0,
                      },
                    ])
                  }
                  className="text-sm font-semibold text-primary"
                >
                  + Add pricing plan
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-sm">
            <p>
              <strong>Name:</strong> {form.fullName}
            </p>
            <p>
              <strong>Email:</strong> {form.email}
            </p>
            <p>
              <strong>Headline:</strong> {form.headline || "—"}
            </p>
            <p>
              <strong>Formats:</strong>{" "}
              {Object.entries(form.formats)
                .filter(([, v]) => v)
                .map(([k]) => TEACHING_FORMATS.find((f) => f.value === k)?.label)
                .join(", ") || "—"}
            </p>
            <p>
              <strong>Pricing plans:</strong>{" "}
              {form.pricingPlans
                .map((p) => `${p.courseType || "Untitled"} (€${p.price || 0})`)
                .join(", ") || "—"}
            </p>
            <p className="text-neutral-900/60">
              Our team will review your profile within 48 hours of
              submission.
            </p>
            {errorMessage && (
              <p className="text-tertiary">{errorMessage}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-md border border-black/15 px-5 py-2 text-sm font-semibold disabled:opacity-40"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canProceed()}
            className="rounded-md bg-secondary px-5 py-2 text-sm font-bold text-primary-dark disabled:opacity-40"
          >
            Continue &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "submitting"}
            className="rounded-md bg-secondary px-5 py-2 text-sm font-bold text-primary-dark disabled:opacity-40"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}
