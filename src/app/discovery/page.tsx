import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DiscoveryForm } from "@/components/discovery-form";
import type { Specialization } from "@/lib/types";

export default async function DiscoveryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  // Middleware guarantees a session; the students row is created on
  // first login (see resolvePostLoginRedirect). If it's somehow still
  // missing, there's nothing sensible to show here.
  if (!student) {
    redirect("/");
  }

  const { data: specializationsData } = await supabase
    .from("specializations")
    .select("*")
    .order("sort_order");
  const specializations = (specializationsData ?? []) as Specialization[];

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-headline text-3xl font-extrabold text-primary">
        Find Your Starting Point
      </h1>
      <p className="mt-2 text-neutral-900/70">
        Answer a couple of quick questions and we&apos;ll point you to the
        right teachers.
      </p>

      <div className="mt-8">
        <DiscoveryForm studentId={student.id} specializations={specializations} />
      </div>
    </div>
  );
}
