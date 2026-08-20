import type { Tables } from "@/lib/supabase/types";

export type Teacher = Tables<"teachers">;
export type PricingPlan = Tables<"pricing_plans">;
export type PriceTierDefinition = Tables<"price_tier_definitions">;
export type Specialization = Tables<"specializations">;
export type TeacherQualification = Tables<"teacher_qualifications">;
export type TeacherAvailability = Tables<"teacher_availability">;
export type TeacherTeachingFormat = Tables<"teacher_teaching_formats">;

export type TeacherSpecialization = Tables<"teacher_specializations"> & {
  specialization: Specialization | null;
};

export type TeacherListItem = Teacher & {
  pricing_plans: PricingPlan[];
  teacher_specializations: TeacherSpecialization[];
  teacher_teaching_formats: TeacherTeachingFormat[];
};

export type TeacherProfile = TeacherListItem & {
  teacher_qualifications: TeacherQualification[];
  teacher_availability: TeacherAvailability[];
};
