import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Decides where to send a just-authenticated user, and lazily creates
 * their `students` row on first login after email confirmation (the
 * signup form can't create it itself when confirmation is required,
 * since there's no session yet at signUp() time).
 *
 * Teachers are provisioned out-of-band (invited/created directly in
 * Supabase — there's no teacher signup route), so a `teachers` row
 * always wins if one exists. Everyone else is treated as a student,
 * since those are the only two identities this app has today.
 */
export async function resolvePostLoginRedirect(
  supabase: SupabaseClient<Database>
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "/login";

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (teacher) return "/";

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  let studentId = existingStudent?.id;

  if (!studentId) {
    const { data: created } = await supabase
      .from("students")
      .insert({
        auth_user_id: user.id,
        email: user.email ?? null,
        full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      })
      .select("id")
      .single();
    studentId = created?.id;
  }

  if (!studentId) return "/";

  const { data: response } = await supabase
    .from("discovery_responses")
    .select("id")
    .eq("student_id", studentId)
    .limit(1)
    .maybeSingle();

  return response ? "/teachers" : "/discovery";
}
