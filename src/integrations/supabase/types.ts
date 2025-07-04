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
      active_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          last_activity: string
          session_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_feature_models: {
        Row: {
          created_at: string
          fallback_model_id: string | null
          feature_name: string
          id: string
          is_active: boolean
          primary_model_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fallback_model_id?: string | null
          feature_name: string
          id?: string
          is_active?: boolean
          primary_model_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fallback_model_id?: string | null
          feature_name?: string
          id?: string
          is_active?: boolean
          primary_model_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feature_models_fallback_model_id_fkey"
            columns: ["fallback_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_feature_models_primary_model_id_fkey"
            columns: ["primary_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generation_logs: {
        Row: {
          condition_type: string | null
          created_at: string | null
          credits_used: number | null
          error_message: string | null
          extra_calories: number | null
          generation_type: string
          id: string
          prompt_data: Json
          response_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          condition_type?: string | null
          created_at?: string | null
          credits_used?: number | null
          error_message?: string | null
          extra_calories?: number | null
          generation_type: string
          id?: string
          prompt_data: Json
          response_data?: Json | null
          status: string
          user_id: string
        }
        Update: {
          condition_type?: string | null
          created_at?: string | null
          credits_used?: number | null
          error_message?: string | null
          extra_calories?: number | null
          generation_type?: string
          id?: string
          prompt_data?: Json
          response_data?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          capabilities: string[]
          context_window: number | null
          cost_per_1k_tokens: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          max_tokens: number | null
          model_id: string
          name: string
          provider: string
          updated_at: string
        }
        Insert: {
          capabilities?: string[]
          context_window?: number | null
          cost_per_1k_tokens?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          max_tokens?: number | null
          model_id: string
          name: string
          provider: string
          updated_at?: string
        }
        Update: {
          capabilities?: string[]
          context_window?: number | null
          cost_per_1k_tokens?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          max_tokens?: number | null
          model_id?: string
          name?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      coach_tasks: {
        Row: {
          coach_id: string
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          title: string
          trainee_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          title: string
          trainee_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          title?: string
          trainee_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_tasks_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_tasks_trainee_id_fkey"
            columns: ["trainee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_trainee_messages: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          message_type: string
          sender_id: string
          sender_type: string
          trainee_id: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          message_type?: string
          sender_id: string
          sender_type: string
          trainee_id: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          message_type?: string
          sender_id?: string
          sender_type?: string
          trainee_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_trainee_messages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_trainee_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_trainee_messages_trainee_id_fkey"
            columns: ["trainee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_trainees: {
        Row: {
          assigned_at: string | null
          coach_id: string
          id: string
          notes: string | null
          trainee_id: string
        }
        Insert: {
          assigned_at?: string | null
          coach_id: string
          id?: string
          notes?: string | null
          trainee_id: string
        }
        Update: {
          assigned_at?: string | null
          coach_id?: string
          id?: string
          notes?: string | null
          trainee_id?: string
        }
        Relationships: []
      }
      daily_meals: {
        Row: {
          alternatives: Json | null
          calories: number | null
          carbs: number | null
          cook_time: number | null
          created_at: string | null
          day_number: number
          fat: number | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: string[] | null
          meal_type: string
          name: string
          prep_time: number | null
          protein: number | null
          recipe_fetched: boolean | null
          servings: number | null
          weekly_plan_id: string
          youtube_search_term: string | null
        }
        Insert: {
          alternatives?: Json | null
          calories?: number | null
          carbs?: number | null
          cook_time?: number | null
          created_at?: string | null
          day_number: number
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          meal_type: string
          name: string
          prep_time?: number | null
          protein?: number | null
          recipe_fetched?: boolean | null
          servings?: number | null
          weekly_plan_id: string
          youtube_search_term?: string | null
        }
        Update: {
          alternatives?: Json | null
          calories?: number | null
          carbs?: number | null
          cook_time?: number | null
          created_at?: string | null
          day_number?: number
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          meal_type?: string
          name?: string
          prep_time?: number | null
          protein?: number | null
          recipe_fetched?: boolean | null
          servings?: number | null
          weekly_plan_id?: string
          youtube_search_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_meals_weekly_plan_id_fkey"
            columns: ["weekly_plan_id"]
            isOneToOne: false
            referencedRelation: "weekly_meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_daily_meals_weekly_plan"
            columns: ["weekly_plan_id"]
            isOneToOne: false
            referencedRelation: "weekly_meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_workouts: {
        Row: {
          completed: boolean | null
          created_at: string | null
          day_number: number
          estimated_calories: number | null
          estimated_duration: number | null
          id: string
          muscle_groups: string[] | null
          updated_at: string | null
          weekly_program_id: string
          workout_name: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          day_number: number
          estimated_calories?: number | null
          estimated_duration?: number | null
          id?: string
          muscle_groups?: string[] | null
          updated_at?: string | null
          weekly_program_id: string
          workout_name: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          day_number?: number
          estimated_calories?: number | null
          estimated_duration?: number | null
          id?: string
          muscle_groups?: string[] | null
          updated_at?: string | null
          weekly_program_id?: string
          workout_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_workouts_weekly_program_id_fkey"
            columns: ["weekly_program_id"]
            isOneToOne: false
            referencedRelation: "weekly_exercise_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          actual_reps: string | null
          actual_sets: number | null
          completed: boolean | null
          created_at: string | null
          daily_workout_id: string
          difficulty: string | null
          equipment: string | null
          id: string
          instructions: string | null
          muscle_groups: string[] | null
          name: string
          notes: string | null
          order_number: number | null
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          updated_at: string | null
          youtube_search_term: string | null
        }
        Insert: {
          actual_reps?: string | null
          actual_sets?: number | null
          completed?: boolean | null
          created_at?: string | null
          daily_workout_id: string
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_groups?: string[] | null
          name: string
          notes?: string | null
          order_number?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string | null
          youtube_search_term?: string | null
        }
        Update: {
          actual_reps?: string | null
          actual_sets?: number | null
          completed?: boolean | null
          created_at?: string | null
          daily_workout_id?: string
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_groups?: string[] | null
          name?: string
          notes?: string | null
          order_number?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          updated_at?: string | null
          youtube_search_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_daily_workout_id_fkey"
            columns: ["daily_workout_id"]
            isOneToOne: false
            referencedRelation: "daily_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      food_consumption_log: {
        Row: {
          ai_analysis_data: Json | null
          calories_consumed: number
          carbs_consumed: number
          consumed_at: string | null
          created_at: string | null
          fat_consumed: number
          food_item_id: string
          id: string
          meal_image_url: string | null
          meal_type: string | null
          notes: string | null
          protein_consumed: number
          quantity_g: number
          source: string | null
          user_id: string
        }
        Insert: {
          ai_analysis_data?: Json | null
          calories_consumed: number
          carbs_consumed: number
          consumed_at?: string | null
          created_at?: string | null
          fat_consumed: number
          food_item_id: string
          id?: string
          meal_image_url?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_consumed: number
          quantity_g?: number
          source?: string | null
          user_id: string
        }
        Update: {
          ai_analysis_data?: Json | null
          calories_consumed?: number
          carbs_consumed?: number
          consumed_at?: string | null
          created_at?: string | null
          fat_consumed?: number
          food_item_id?: string
          id?: string
          meal_image_url?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_consumed?: number
          quantity_g?: number
          source?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_consumption_log_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_database: {
        Row: {
          calories_per_unit: number
          carbs_per_unit: number
          confidence_score: number | null
          created_at: string | null
          cuisine_type: string | null
          fat_per_unit: number
          fiber_per_unit: number | null
          id: string
          last_analyzed: string | null
          name: string
          protein_per_unit: number
          source: string | null
          sugar_per_unit: number | null
          unit_type: string
        }
        Insert: {
          calories_per_unit?: number
          carbs_per_unit?: number
          confidence_score?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          fat_per_unit?: number
          fiber_per_unit?: number | null
          id?: string
          last_analyzed?: string | null
          name: string
          protein_per_unit?: number
          source?: string | null
          sugar_per_unit?: number | null
          unit_type?: string
        }
        Update: {
          calories_per_unit?: number
          carbs_per_unit?: number
          confidence_score?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          fat_per_unit?: number
          fiber_per_unit?: number | null
          id?: string
          last_analyzed?: string | null
          name?: string
          protein_per_unit?: number
          source?: string | null
          sugar_per_unit?: number | null
          unit_type?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_per_100g: number
          carbs_per_100g: number
          category: string
          confidence_score: number | null
          created_at: string | null
          cuisine_type: string | null
          fat_per_100g: number
          fiber_per_100g: number | null
          id: string
          image_url: string | null
          name: string
          protein_per_100g: number
          serving_description: string | null
          serving_size_g: number | null
          sodium_per_100g: number | null
          source: string | null
          sugar_per_100g: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          name: string
          protein_per_100g?: number
          serving_description?: string | null
          serving_size_g?: number | null
          sodium_per_100g?: number | null
          source?: string | null
          sugar_per_100g?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          cuisine_type?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          name?: string
          protein_per_100g?: number
          serving_description?: string | null
          serving_size_g?: number | null
          sodium_per_100g?: number | null
          source?: string | null
          sugar_per_100g?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      food_search_history: {
        Row: {
          created_at: string | null
          id: string
          results_count: number | null
          search_term: string
          search_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_term: string
          search_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_term?: string
          search_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_assessments: {
        Row: {
          assessment_type: string
          chronic_conditions: string[] | null
          commitment_level: number | null
          completed_at: string | null
          cooking_skills: string | null
          created_at: string | null
          energy_level: number | null
          exercise_history: string | null
          health_score: number | null
          id: string
          injuries: string[] | null
          medications: string[] | null
          nutrition_knowledge: string | null
          physical_limitations: string[] | null
          primary_motivation: string[] | null
          readiness_score: number | null
          risk_score: number | null
          sleep_quality: number | null
          specific_goals: string[] | null
          stress_level: number | null
          time_availability: string | null
          timeline_expectation: string | null
          updated_at: string | null
          user_id: string
          work_schedule: string | null
        }
        Insert: {
          assessment_type?: string
          chronic_conditions?: string[] | null
          commitment_level?: number | null
          completed_at?: string | null
          cooking_skills?: string | null
          created_at?: string | null
          energy_level?: number | null
          exercise_history?: string | null
          health_score?: number | null
          id?: string
          injuries?: string[] | null
          medications?: string[] | null
          nutrition_knowledge?: string | null
          physical_limitations?: string[] | null
          primary_motivation?: string[] | null
          readiness_score?: number | null
          risk_score?: number | null
          sleep_quality?: number | null
          specific_goals?: string[] | null
          stress_level?: number | null
          time_availability?: string | null
          timeline_expectation?: string | null
          updated_at?: string | null
          user_id: string
          work_schedule?: string | null
        }
        Update: {
          assessment_type?: string
          chronic_conditions?: string[] | null
          commitment_level?: number | null
          completed_at?: string | null
          cooking_skills?: string | null
          created_at?: string | null
          energy_level?: number | null
          exercise_history?: string | null
          health_score?: number | null
          id?: string
          injuries?: string[] | null
          medications?: string[] | null
          nutrition_knowledge?: string | null
          physical_limitations?: string[] | null
          primary_motivation?: string[] | null
          readiness_score?: number | null
          risk_score?: number | null
          sleep_quality?: number | null
          specific_goals?: string[] | null
          stress_level?: number | null
          time_availability?: string | null
          timeline_expectation?: string | null
          updated_at?: string | null
          user_id?: string
          work_schedule?: string | null
        }
        Relationships: []
      }
      meal_comments: {
        Row: {
          body: string
          coach_id: string
          created_at: string
          id: string
          meal_log_id: string
          trainee_id: string
        }
        Insert: {
          body: string
          coach_id: string
          created_at?: string
          id?: string
          meal_log_id: string
          trainee_id: string
        }
        Update: {
          body?: string
          coach_id?: string
          created_at?: string
          id?: string
          meal_log_id?: string
          trainee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_comments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_comments_meal_log_id_fkey"
            columns: ["meal_log_id"]
            isOneToOne: false
            referencedRelation: "food_consumption_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_comments_trainee_id_fkey"
            columns: ["trainee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          basic_info_completed: boolean | null
          basic_info_completed_at: string | null
          body_shape_completed: boolean | null
          body_shape_completed_at: string | null
          completed_at: string | null
          completion_percentage: number | null
          current_step: number | null
          demographics_completed: boolean | null
          demographics_completed_at: string | null
          dietary_preferences_completed: boolean | null
          dietary_preferences_completed_at: string | null
          fitness_goals_completed: boolean | null
          fitness_goals_completed_at: string | null
          goals_setup_completed: boolean | null
          goals_setup_completed_at: string | null
          health_assessment_completed: boolean | null
          health_assessment_completed_at: string | null
          id: string
          preferences_completed: boolean | null
          preferences_completed_at: string | null
          profile_review_completed: boolean | null
          profile_review_completed_at: string | null
          skip_reasons: Json | null
          skipped_steps: string[] | null
          started_at: string | null
          total_steps: number | null
          updated_at: string | null
          user_id: string
          welcome_viewed: boolean | null
          welcome_viewed_at: string | null
        }
        Insert: {
          basic_info_completed?: boolean | null
          basic_info_completed_at?: string | null
          body_shape_completed?: boolean | null
          body_shape_completed_at?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          current_step?: number | null
          demographics_completed?: boolean | null
          demographics_completed_at?: string | null
          dietary_preferences_completed?: boolean | null
          dietary_preferences_completed_at?: string | null
          fitness_goals_completed?: boolean | null
          fitness_goals_completed_at?: string | null
          goals_setup_completed?: boolean | null
          goals_setup_completed_at?: string | null
          health_assessment_completed?: boolean | null
          health_assessment_completed_at?: string | null
          id?: string
          preferences_completed?: boolean | null
          preferences_completed_at?: string | null
          profile_review_completed?: boolean | null
          profile_review_completed_at?: string | null
          skip_reasons?: Json | null
          skipped_steps?: string[] | null
          started_at?: string | null
          total_steps?: number | null
          updated_at?: string | null
          user_id: string
          welcome_viewed?: boolean | null
          welcome_viewed_at?: string | null
        }
        Update: {
          basic_info_completed?: boolean | null
          basic_info_completed_at?: string | null
          body_shape_completed?: boolean | null
          body_shape_completed_at?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          current_step?: number | null
          demographics_completed?: boolean | null
          demographics_completed_at?: string | null
          dietary_preferences_completed?: boolean | null
          dietary_preferences_completed_at?: string | null
          fitness_goals_completed?: boolean | null
          fitness_goals_completed_at?: string | null
          goals_setup_completed?: boolean | null
          goals_setup_completed_at?: string | null
          health_assessment_completed?: boolean | null
          health_assessment_completed_at?: string | null
          id?: string
          preferences_completed?: boolean | null
          preferences_completed_at?: string | null
          profile_review_completed?: boolean | null
          profile_review_completed_at?: string | null
          skip_reasons?: Json | null
          skipped_steps?: string[] | null
          started_at?: string | null
          total_steps?: number | null
          updated_at?: string | null
          user_id?: string
          welcome_viewed?: boolean | null
          welcome_viewed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          ai_generations_remaining: number | null
          allergies: string[] | null
          bio: string | null
          body_fat_percentage: number | null
          body_shape: string | null
          breastfeeding_level: string | null
          condition_start_date: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          email: string | null
          fasting_type: string | null
          first_name: string | null
          fitness_goal: string | null
          gender: string | null
          health_conditions: string[] | null
          height: number | null
          id: string
          is_online: boolean | null
          last_health_assessment_date: string | null
          last_name: string | null
          last_seen: string | null
          location: string | null
          nationality: string | null
          onboarding_completed: boolean | null
          preferred_foods: string[] | null
          preferred_language: string | null
          pregnancy_trimester: number | null
          profile_completion_score: number | null
          profile_visibility: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          special_conditions: Json | null
          timezone: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          ai_generations_remaining?: number | null
          allergies?: string[] | null
          bio?: string | null
          body_fat_percentage?: number | null
          body_shape?: string | null
          breastfeeding_level?: string | null
          condition_start_date?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          fasting_type?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id: string
          is_online?: boolean | null
          last_health_assessment_date?: string | null
          last_name?: string | null
          last_seen?: string | null
          location?: string | null
          nationality?: string | null
          onboarding_completed?: boolean | null
          preferred_foods?: string[] | null
          preferred_language?: string | null
          pregnancy_trimester?: number | null
          profile_completion_score?: number | null
          profile_visibility?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          special_conditions?: Json | null
          timezone?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          ai_generations_remaining?: number | null
          allergies?: string[] | null
          bio?: string | null
          body_fat_percentage?: number | null
          body_shape?: string | null
          breastfeeding_level?: string | null
          condition_start_date?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          fasting_type?: string | null
          first_name?: string | null
          fitness_goal?: string | null
          gender?: string | null
          health_conditions?: string[] | null
          height?: number | null
          id?: string
          is_online?: boolean | null
          last_health_assessment_date?: string | null
          last_name?: string | null
          last_seen?: string | null
          location?: string | null
          nationality?: string | null
          onboarding_completed?: boolean | null
          preferred_foods?: string[] | null
          preferred_language?: string | null
          pregnancy_trimester?: number | null
          profile_completion_score?: number | null
          profile_visibility?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          special_conditions?: Json | null
          timezone?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: string | null
          plan_type: string | null
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          plan_type?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          plan_type?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          chat_room_id: string
          id: string
          is_typing: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_room_id: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_room_id?: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress_data: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_foods: {
        Row: {
          created_at: string | null
          custom_name: string | null
          custom_serving_size_g: number | null
          food_item_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_name?: string | null
          custom_serving_size_g?: number | null
          food_item_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_name?: string | null
          custom_serving_size_g?: number | null
          food_item_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_foods_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          category: string
          created_at: string | null
          id: string
          message: string
          page_url: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          message: string
          page_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          message?: string
          page_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string
          created_at: string | null
          current_value: number | null
          description: string | null
          difficulty: string | null
          goal_type: string
          id: string
          milestones: Json | null
          notes: string | null
          priority: string | null
          start_date: string
          status: string
          tags: string[] | null
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          difficulty?: string | null
          goal_type: string
          id?: string
          milestones?: Json | null
          notes?: string | null
          priority?: string | null
          start_date?: string
          status?: string
          tags?: string[] | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          difficulty?: string | null
          goal_type?: string
          id?: string
          milestones?: Json | null
          notes?: string | null
          priority?: string | null
          start_date?: string
          status?: string
          tags?: string[] | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_suggestions: boolean | null
          automatic_exercise_planning: boolean | null
          automatic_meal_planning: boolean | null
          created_at: string | null
          data_sharing_analytics: boolean | null
          data_sharing_research: boolean | null
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          meal_reminder_times: Json | null
          measurement_units: string | null
          preferred_language: string | null
          profile_visibility: string | null
          progress_reminders: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
          workout_reminder_time: string | null
        }
        Insert: {
          ai_suggestions?: boolean | null
          automatic_exercise_planning?: boolean | null
          automatic_meal_planning?: boolean | null
          created_at?: string | null
          data_sharing_analytics?: boolean | null
          data_sharing_research?: boolean | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          meal_reminder_times?: Json | null
          measurement_units?: string | null
          preferred_language?: string | null
          profile_visibility?: string | null
          progress_reminders?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
          workout_reminder_time?: string | null
        }
        Update: {
          ai_suggestions?: boolean | null
          automatic_exercise_planning?: boolean | null
          automatic_meal_planning?: boolean | null
          created_at?: string | null
          data_sharing_analytics?: boolean | null
          data_sharing_research?: boolean | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          meal_reminder_times?: Json | null
          measurement_units?: string | null
          preferred_language?: string | null
          profile_visibility?: string | null
          progress_reminders?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
          workout_reminder_time?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_exercise_programs: {
        Row: {
          created_at: string | null
          current_week: number | null
          difficulty_level: string | null
          generation_prompt: Json | null
          id: string
          program_name: string
          status: string | null
          total_estimated_calories: number | null
          updated_at: string | null
          user_id: string
          week_start_date: string
          workout_type: string | null
        }
        Insert: {
          created_at?: string | null
          current_week?: number | null
          difficulty_level?: string | null
          generation_prompt?: Json | null
          id?: string
          program_name: string
          status?: string | null
          total_estimated_calories?: number | null
          updated_at?: string | null
          user_id: string
          week_start_date: string
          workout_type?: string | null
        }
        Update: {
          created_at?: string | null
          current_week?: number | null
          difficulty_level?: string | null
          generation_prompt?: Json | null
          id?: string
          program_name?: string
          status?: string | null
          total_estimated_calories?: number | null
          updated_at?: string | null
          user_id?: string
          week_start_date?: string
          workout_type?: string | null
        }
        Relationships: []
      }
      weekly_meal_plans: {
        Row: {
          created_at: string | null
          generation_prompt: Json | null
          id: string
          life_phase_context: Json | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          generation_prompt?: Json | null
          id?: string
          life_phase_context?: Json | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string | null
          generation_prompt?: Json | null
          id?: string
          life_phase_context?: Json | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string
          week_start_date?: string
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
      calculate_calorie_offset: {
        Args: { pregnancy_trimester: number; breastfeeding_level: string }
        Returns: number
      }
      calculate_profile_completion_score: {
        Args: { user_id_param: string }
        Returns: number
      }
      check_and_use_ai_generation: {
        Args: {
          user_id_param: string
          generation_type_param: string
          prompt_data_param?: Json
        }
        Returns: Json
      }
      cleanup_old_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_typing_indicators: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      complete_ai_generation: {
        Args: {
          log_id_param: string
          response_data_param?: Json
          error_message_param?: string
        }
        Returns: undefined
      }
      create_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement_ai_generations: {
        Args: { user_id: string }
        Returns: boolean
      }
      force_logout_all_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_exercise_program: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_assigned_trainees: {
        Args: { coach_id: string }
        Returns: {
          trainee_id: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      invalidate_all_user_sessions: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_coach: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_pro_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_user_trainee_of_coach: {
        Args: { trainee_id: string; coach_id: string }
        Returns: boolean
      }
      reset_ai_generations: {
        Args: { target_user_id: string; new_count?: number }
        Returns: undefined
      }
      search_food_database: {
        Args: { search_term: string }
        Returns: {
          id: string
          name: string
          calories_per_unit: number
          protein_per_unit: number
          carbs_per_unit: number
          fat_per_unit: number
          fiber_per_unit: number
          sugar_per_unit: number
          unit_type: string
          confidence_score: number
          cuisine_type: string
        }[]
      }
      search_food_items: {
        Args: {
          search_term: string
          category_filter?: string
          limit_count?: number
        }
        Returns: {
          id: string
          name: string
          brand: string
          category: string
          cuisine_type: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          fiber_per_100g: number
          sugar_per_100g: number
          sodium_per_100g: number
          serving_size_g: number
          serving_description: string
          confidence_score: number
          verified: boolean
          image_url: string
          similarity_score: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      shuffle_weekly_meals: {
        Args: { p_user_id: string; p_week_start_date: string }
        Returns: Json
      }
      update_user_online_status: {
        Args: { user_id: string; is_online: boolean }
        Returns: undefined
      }
      update_user_role: {
        Args: {
          target_user_id: string
          new_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      user_role: "normal" | "pro" | "coach" | "admin"
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
    Enums: {
      app_role: ["admin", "user"],
      user_role: ["normal", "pro", "coach", "admin"],
    },
  },
} as const
