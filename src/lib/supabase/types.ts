export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          id: string
          message: string | null
          pricing_plan_id: string | null
          requested_date: string
          requested_time: string
          status: string
          student_email: string
          student_name: string
          student_phone: string | null
          teacher_id: string
          timezone: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          pricing_plan_id?: string | null
          requested_date: string
          requested_time: string
          status?: string
          student_email: string
          student_name: string
          student_phone?: string | null
          teacher_id: string
          timezone?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          pricing_plan_id?: string | null
          requested_date?: string
          requested_time?: string
          status?: string
          student_email?: string
          student_name?: string
          student_phone?: string | null
          teacher_id?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_responses: {
        Row: {
          computed_level: string | null
          created_at: string
          id: string
          proficiency_answers: Json
          reason_for_learning: string | null
          recommended_specialization_ids: string[]
          student_id: string
        }
        Insert: {
          computed_level?: string | null
          created_at?: string
          id?: string
          proficiency_answers?: Json
          reason_for_learning?: string | null
          recommended_specialization_ids?: string[]
          student_id: string
        }
        Update: {
          computed_level?: string | null
          created_at?: string
          id?: string
          proficiency_answers?: Json
          reason_for_learning?: string | null
          recommended_specialization_ids?: string[]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      price_tier_definitions: {
        Row: {
          description: string
          max_rate: number | null
          min_rate: number
          name: string
          requirements: string[]
          sort_order: number
          tier: number
        }
        Insert: {
          description: string
          max_rate?: number | null
          min_rate: number
          name: string
          requirements?: string[]
          sort_order?: number
          tier: number
        }
        Update: {
          description?: string
          max_rate?: number | null
          min_rate?: number
          name?: string
          requirements?: string[]
          sort_order?: number
          tier?: number
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          course_type: string
          id: string
          is_popular: boolean
          price_amount: number
          session_length_minutes: number
          sort_order: number
          teacher_id: string
          tier: number
        }
        Insert: {
          course_type: string
          id?: string
          is_popular?: boolean
          price_amount: number
          session_length_minutes?: number
          sort_order?: number
          teacher_id: string
          tier: number
        }
        Update: {
          course_type?: string
          id?: string
          is_popular?: boolean
          price_amount?: number
          session_length_minutes?: number
          sort_order?: number
          teacher_id?: string
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_plans_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_plans_tier_fkey"
            columns: ["tier"]
            isOneToOne: false
            referencedRelation: "price_tier_definitions"
            referencedColumns: ["tier"]
          },
        ]
      }
      specializations: {
        Row: {
          category: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      students: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          teacher_id: string
          timezone: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          teacher_id: string
          timezone?: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          teacher_id?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_qualifications: {
        Row: {
          id: string
          qualification: string
          sort_order: number
          teacher_id: string
        }
        Insert: {
          id?: string
          qualification: string
          sort_order?: number
          teacher_id: string
        }
        Update: {
          id?: string
          qualification?: string
          sort_order?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_qualifications_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_specializations: {
        Row: {
          custom_name: string | null
          description: string | null
          id: string
          specialization_id: string | null
          teacher_id: string
        }
        Insert: {
          custom_name?: string | null
          description?: string | null
          id?: string
          specialization_id?: string | null
          teacher_id: string
        }
        Update: {
          custom_name?: string | null
          description?: string | null
          id?: string
          specialization_id?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_specializations_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_specializations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_teaching_formats: {
        Row: {
          custom_description: string | null
          format: string
          teacher_id: string
        }
        Insert: {
          custom_description?: string | null
          format: string
          teacher_id: string
        }
        Update: {
          custom_description?: string | null
          format?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_teaching_formats_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          auth_user_id: string | null
          available_for_own_courses: boolean
          bio: string | null
          created_at: string
          cv_url: string | null
          email: string
          full_name: string
          headline: string | null
          id: string
          interview_notes: string | null
          interview_status: string
          intro_video_url: string | null
          is_daf_certified: boolean
          is_native_speaker: boolean
          phone: string | null
          photo_url: string | null
          rating: number
          review_count: number
          status: string
          teaching_philosophy: string | null
          timezone: string
          updated_at: string
          vetting_notes: string | null
        }
        Insert: {
          auth_user_id?: string | null
          available_for_own_courses?: boolean
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          email: string
          full_name: string
          headline?: string | null
          id?: string
          interview_notes?: string | null
          interview_status?: string
          intro_video_url?: string | null
          is_daf_certified?: boolean
          is_native_speaker?: boolean
          phone?: string | null
          photo_url?: string | null
          rating?: number
          review_count?: number
          status?: string
          teaching_philosophy?: string | null
          timezone?: string
          updated_at?: string
          vetting_notes?: string | null
        }
        Update: {
          auth_user_id?: string | null
          available_for_own_courses?: boolean
          bio?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string
          full_name?: string
          headline?: string | null
          id?: string
          interview_notes?: string | null
          interview_status?: string
          intro_video_url?: string | null
          is_daf_certified?: boolean
          is_native_speaker?: boolean
          phone?: string | null
          photo_url?: string | null
          rating?: number
          review_count?: number
          status?: string
          teaching_philosophy?: string | null
          timezone?: string
          updated_at?: string
          vetting_notes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_teacher_application: { Args: { payload: Json }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
