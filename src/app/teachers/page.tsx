import { createClient } from "@/lib/supabase/server";
import { TeacherDirectory } from "@/components/teacher-directory";
import type {
  PriceTierDefinition,
  Specialization,
  TeacherListItem,
} from "@/lib/types";

export const revalidate = 60;

export default async function TeachersPage() {
  const supabase = await createClient();

  const [teachersRes, tiersRes, specializationsRes] = await Promise.all([
    supabase
      .from("teachers")
      .select(
        "*, pricing_plans(*), teacher_teaching_formats(*), teacher_specializations(*, specialization:specializations(*))"
      )
      .eq("status", "approved")
      .order("rating", { ascending: false }),
    supabase
      .from("price_tier_definitions")
      .select("*")
      .order("sort_order"),
    supabase.from("specializations").select("*").order("sort_order"),
  ]);

  const teachers = (teachersRes.data ?? []) as unknown as TeacherListItem[];
  const tiers = (tiersRes.data ?? []) as PriceTierDefinition[];
  const specializations = (specializationsRes.data ??
    []) as Specialization[];

  return (
    <>
      <div className="border-b border-black/10 bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="font-headline text-3xl font-extrabold text-primary sm:text-4xl">
            Find the Perfect German Teacher for Your Goals
          </h1>
          <p className="mt-2 max-w-xl text-neutral-900/70">
            Filter by specialty, price, and availability.
          </p>
        </div>
      </div>

      <TeacherDirectory
        teachers={teachers}
        tiers={tiers}
        specializations={specializations}
      />
    </>
  );
}
