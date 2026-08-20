"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WEEKDAY_LABELS } from "@/lib/constants";
import type { PricingPlan, TeacherAvailability } from "@/lib/types";

function nextAvailableDates(
  availability: TeacherAvailability[],
  daysAhead = 21
) {
  const availableWeekdays = new Set(availability.map((a) => a.day_of_week));
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAhead && dates.length < 8; i++) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + i);
    if (availableWeekdays.has(candidate.getDay())) {
      dates.push(candidate);
    }
  }
  return dates;
}

function slotsForDate(date: Date, availability: TeacherAvailability[]) {
  const dayRows = availability.filter((a) => a.day_of_week === date.getDay());
  const slots: string[] = [];

  for (const row of dayRows) {
    const [startH] = row.start_time.split(":").map(Number);
    const [endH] = row.end_time.split(":").map(Number);
    for (let hour = startH; hour < endH; hour += 2) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
    }
  }
  return slots;
}

export function BookingWidget({
  teacherId,
  pricingPlans,
  availability,
  timezone,
}: {
  teacherId: string;
  pricingPlans: PricingPlan[];
  availability: TeacherAvailability[];
  timezone: string;
}) {
  const dates = useMemo(
    () => nextAvailableDates(availability),
    [availability]
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dates[0] ?? null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string>(pricingPlans[0]?.id ?? "");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );

  const slots = selectedDate ? slotsForDate(selectedDate, availability) : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      teacher_id: teacherId,
      pricing_plan_id: planId || null,
      student_name: form.name,
      student_email: form.email,
      message: form.message || null,
      requested_date: selectedDate.toISOString().slice(0, 10),
      requested_time: `${selectedTime}:00`,
      timezone,
    });

    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-6 text-center">
        <p className="font-headline text-lg font-bold text-primary">
          Request sent!
        </p>
        <p className="mt-2 text-sm text-neutral-900/70">
          The teacher will confirm your lesson shortly. No charge until
          confirmed.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-black/10 bg-white p-6"
    >
      <h2 className="font-headline text-lg font-bold text-primary">
        Book a Lesson
      </h2>
      <p className="text-xs text-neutral-900/50">Timezone: {timezone}</p>

      {pricingPlans.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-neutral-900">
            Course
          </label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          >
            {pricingPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.course_type} &mdash; &euro;
                {Number(plan.price_amount).toFixed(0)}/
                {plan.session_length_minutes}min
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-neutral-900">Date</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {dates.length === 0 && (
            <p className="text-sm text-neutral-900/60">
              No upcoming availability listed.
            </p>
          )}
          {dates.map((date) => (
            <button
              type="button"
              key={date.toISOString()}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                selectedDate?.toDateString() === date.toDateString()
                  ? "border-primary bg-primary text-white"
                  : "border-black/15 bg-white text-neutral-900"
              }`}
            >
              {WEEKDAY_LABELS[date.getDay()].slice(0, 3)}{" "}
              {date.getDate()}/{date.getMonth() + 1}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <p className="text-sm font-semibold text-neutral-900">Time</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {slots.length === 0 && (
              <p className="text-sm text-neutral-900/60">
                No slots this day.
              </p>
            )}
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                  selectedTime === slot
                    ? "border-primary bg-primary text-white"
                    : "border-black/15 bg-white text-neutral-900"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Anything the teacher should know? (optional)"
          value={form.message}
          onChange={(e) =>
            setForm((f) => ({ ...f, message: e.target.value }))
          }
          rows={3}
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!selectedDate || !selectedTime || status === "submitting"}
        className="w-full rounded-md bg-secondary py-3 text-sm font-bold text-primary-dark transition hover:brightness-95 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Continue to Booking"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-tertiary">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-center text-xs text-neutral-900/50">
        No charge until confirmed
      </p>
    </form>
  );
}
