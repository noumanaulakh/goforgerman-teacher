"use client";

import { useMemo, useState } from "react";
import { TeacherCard } from "@/components/teacher-card";
import { TEACHING_FORMATS } from "@/lib/constants";
import type {
  PriceTierDefinition,
  Specialization,
  TeacherListItem,
} from "@/lib/types";

const PAGE_SIZE = 6;

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <h3 className="font-headline text-base font-bold text-primary">
        {title}
      </h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-900/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-black/20 accent-primary"
      />
      {label}
    </label>
  );
}

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function toggleNumber(set: Set<number>, value: number) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export function TeacherDirectory({
  teachers,
  tiers,
  specializations,
}: {
  teachers: TeacherListItem[];
  tiers: PriceTierDefinition[];
  specializations: Specialization[];
}) {
  const [formats, setFormats] = useState<Set<string>>(new Set());
  const [specs, setSpecs] = useState<Set<string>>(new Set());
  const [selectedTiers, setSelectedTiers] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return teachers.filter((teacher) => {
      if (formats.size > 0) {
        const teacherFormats = teacher.teacher_teaching_formats.map(
          (f) => f.format
        );
        if (![...formats].some((f) => teacherFormats.includes(f))) {
          return false;
        }
      }

      if (specs.size > 0) {
        const teacherSpecNames = teacher.teacher_specializations.map(
          (s) => s.specialization?.name ?? s.custom_name
        );
        if (![...specs].some((s) => teacherSpecNames.includes(s))) {
          return false;
        }
      }

      if (selectedTiers.size > 0) {
        const teacherTiers = teacher.pricing_plans.map((p) => p.tier);
        if (![...selectedTiers].some((t) => teacherTiers.includes(t))) {
          return false;
        }
      }

      return true;
    });
  }, [teachers, formats, specs, selectedTiers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateAndResetPage<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[280px_1fr]">
      <aside className="space-y-6">
        <FilterGroup title="Teaching Format">
          {TEACHING_FORMATS.map((format) => (
            <CheckboxRow
              key={format.value}
              label={format.label}
              checked={formats.has(format.value)}
              onChange={() =>
                updateAndResetPage(setFormats, toggle(formats, format.value))
              }
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Specialization">
          {specializations.map((spec) => (
            <CheckboxRow
              key={spec.id}
              label={spec.name}
              checked={specs.has(spec.name)}
              onChange={() =>
                updateAndResetPage(setSpecs, toggle(specs, spec.name))
              }
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Price Tier">
          {tiers.map((tier) => (
            <CheckboxRow
              key={tier.tier}
              label={`Tier ${tier.tier} (${tier.name})`}
              checked={selectedTiers.has(tier.tier)}
              onChange={() =>
                updateAndResetPage(
                  setSelectedTiers,
                  toggleNumber(selectedTiers, tier.tier)
                )
              }
            />
          ))}
        </FilterGroup>
      </aside>

      <section>
        <p className="mb-4 text-sm text-neutral-900/60">
          {filtered.length} teacher{filtered.length === 1 ? "" : "s"} found
        </p>

        {pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/20 bg-white p-12 text-center text-neutral-900/60">
            No teachers match your filters yet. Try clearing a few.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {pageItems.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} tiers={tiers} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 rounded-md border border-black/10 bg-white text-sm disabled:opacity-40"
              aria-label="Previous page"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-md text-sm font-semibold ${
                  n === currentPage
                    ? "bg-primary text-white"
                    : "border border-black/10 bg-white text-neutral-900"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 rounded-md border border-black/10 bg-white text-sm disabled:opacity-40"
              aria-label="Next page"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
