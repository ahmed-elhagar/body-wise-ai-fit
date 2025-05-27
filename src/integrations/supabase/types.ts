export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercise_programs: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          id: string
          name: string
          program_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          name: string
          program_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          id?: string
          name?: string
          program_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          calories_burned: number | null
          day_of_week: number | null
          duration: number | null
          equipment: string | null
          id: string
          instructions: string | null
          muscle_group: string | null
          name: string
          program_id: string
          reps: string | null
          sets: number | null
          youtube_video_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          day_of_week?: number | null
          duration?: number | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name: string
          program_id: string
          reps?: string | null
          sets?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          day_of_week?: number | null
          duration?: number | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string | null
          name?: string
          program_id?: string
          reps?: string | null
          sets?: number | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "exercise_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      food_diary: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          fat: number | null
          food_name: string
          id: string
          image_url: string | null
          meal_type: string | null
          protein: number | null
          quantity: number | null
          recorded_date: string | null
          unit: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_name: string
          id?: string
          image_url?: string | null
          meal_type?: string | null
          protein?: number | null
          quantity?: number | null
          recorded_date?: string | null
          unit?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_name?: string
          id?: string
          image_url?: string | null
          meal_type?: string | null
          protein?: number | null
          quantity?: number | null
          recorded_date?: string | null
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          created_at: string | null
          id: string
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          cook_time: number | null
          day_of_week: number | null
          fat: number | null
          id: string
          ingredients: Json | null
          meal_plan_id: string
          meal_type: string | null
          name: string
          prep_time: number | null
          protein: number | null
          recipe: string | null
          servings: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          cook_time?: number | null
          day_of_week?: number | null
          fat?: number | null
          id?: string
          ingredients?: Json | null
          meal_plan_id: string
          meal_type?: string | null
          name: string
          prep_time?: number | null
          protein?: number | null
          recipe?: string | null
          servings?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          cook_time?: number | null
          day_of_week?: number | null
          fat?: number | null
          id?: string
          ingredients?: Json | null
          meal_plan_id?: string
          meal_type?: string | null
          name?: string
          prep_time?: number | null
          protein?: number | null
          recipe?: string | null
          servings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          body_shape: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          email: string | null
          first_name: string | null
          fitness_goal: string | null
          gender: string | null
          health_conditions: string[] | null
          height: number | null
          id: string
          last_name: string | null
          nationality: string | null
          preferred_foods: string[] | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          body_shape?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id: string
          last_name?: string | null
          nationality?: string | null
          preferred_foods?: string[] | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          body_shape?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id?: string
          last_name?: string | null
          nationality?: string | null
          preferred_foods?: string[] | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          message: string | null
          reminder_type: string | null
          scheduled_time: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_type?: string | null
          scheduled_time?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_type?: string | null
          scheduled_time?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          body_fat_percentage: number | null
          id: string
          muscle_mass: number | null
          notes: string | null
          recorded_at: string | null
          user_id: string
          weight: number
        }
        Insert: {
          body_fat_percentage?: number | null
          id?: string
          muscle_mass?: number | null
          notes?: string | null
          recorded_at?: string | null
          user_id: string
          weight: number
        }
        Update: {
          body_fat_percentage?: number | null
          id?: string
          muscle_mass?: number | null
          notes?: string | null
          recorded_at?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
