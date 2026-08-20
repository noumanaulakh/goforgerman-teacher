import { createClient } from "@/lib/supabase/server";
import { RegisterWizard } from "@/components/register-wizard";
import type { PriceTierDefinition, Specialization } from "@/lib/types";

export default async function RegisterPage() {
  const supabase = await createClient();

  const [tiersRes, specializationsRes] = await Promise.all([
    supabase.from("price_tier_definitions").select("*").order("sort_order"),
    supabase.from("specializations").select("*").order("sort_order"),
  ]);

  const tiers = (tiersRes.data ?? []) as PriceTierDefinition[];
  const specializations = (specializationsRes.data ??
    []) as Specialization[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-headline text-3xl font-extrabold text-primary">
        Become a Teacher
      </h1>
      <p className="mt-2 text-neutral-900/70">
        Join Go for German&apos;s curated pool of teachers. Our team reviews
        every application within 48 hours.
      </p>

      <div className="mt-8">
        <RegisterWizard tiers={tiers} specializations={specializations} />
      </div>
    </div>
  );
}
