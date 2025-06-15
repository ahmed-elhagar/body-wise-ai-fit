
# FitFatta Backend Implementation Summary

## 📦 Supabase Database Schema

### Core Tables

#### `profiles`
- **id**: uuid (Primary Key, references auth.users)
- **email**: text
- **first_name**: text
- **last_name**: text
- **age**: integer
- **gender**: text
- **height**: numeric (cm)
- **weight**: numeric (kg)
- **fitness_goal**: text
- **activity_level**: text
- **dietary_restrictions**: text[]
- **allergies**: text[]
- **nationality**: text
- **preferred_language**: text (default: 'en')
- **pregnancy_trimester**: smallint
- **breastfeeding_level**: text
- **fasting_type**: text
- **health_conditions**: text[]
- **special_conditions**: jsonb
- **ai_generations_remaining**: integer (default: 5)
- **role**: user_role enum (normal, admin, coach)
- **profile_completion_score**: integer
- **created_at**: timestamp
- **updated_at**: timestamp

#### `weekly_meal_plans`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **week_start_date**: date
- **total_calories**: integer
- **total_protein**: numeric
- **total_carbs**: numeric
- **total_fat**: numeric
- **generation_prompt**: jsonb
- **life_phase_context**: jsonb
- **created_at**: timestamp

#### `daily_meals`
- **id**: uuid (Primary Key)
- **weekly_plan_id**: uuid (Foreign Key → weekly_meal_plans.id)
- **day_number**: integer (1-7)
- **meal_type**: text (breakfast, lunch, dinner, snack)
- **name**: text
- **calories**: integer
- **protein**: numeric
- **carbs**: numeric
- **fat**: numeric
- **prep_time**: integer
- **cook_time**: integer
- **servings**: integer
- **ingredients**: jsonb
- **instructions**: text[]
- **alternatives**: jsonb
- **youtube_search_term**: text
- **image_url**: text
- **recipe_fetched**: boolean
- **created_at**: timestamp

#### `weekly_exercise_programs`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **program_name**: text
- **difficulty_level**: text
- **workout_type**: text (home, gym)
- **current_week**: integer
- **week_start_date**: date
- **total_estimated_calories**: integer
- **generation_prompt**: jsonb
- **status**: text (default: 'active')
- **created_at**: timestamp
- **updated_at**: timestamp

#### `daily_workouts`
- **id**: uuid (Primary Key)
- **weekly_program_id**: uuid (Foreign Key → weekly_exercise_programs.id)
- **day_number**: integer (1-7)
- **workout_name**: text
- **estimated_duration**: integer
- **estimated_calories**: integer
- **muscle_groups**: text[]
- **completed**: boolean
- **created_at**: timestamp
- **updated_at**: timestamp

#### `exercises`
- **id**: uuid (Primary Key)
- **daily_workout_id**: uuid (Foreign Key → daily_workouts.id)
- **name**: text
- **sets**: integer
- **reps**: text
- **rest_seconds**: integer
- **muscle_groups**: text[]
- **instructions**: text
- **youtube_search_term**: text
- **equipment**: text
- **difficulty**: text
- **order_number**: integer
- **completed**: boolean
- **notes**: text
- **actual_sets**: integer
- **actual_reps**: text
- **created_at**: timestamp
- **updated_at**: timestamp

#### `weight_entries`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **weight**: numeric
- **body_fat_percentage**: numeric
- **muscle_mass**: numeric
- **notes**: text
- **recorded_at**: timestamp

#### `food_items`
- **id**: uuid (Primary Key)
- **name**: text
- **brand**: text
- **category**: text
- **calories_per_100g**: numeric
- **protein_per_100g**: numeric
- **carbs_per_100g**: numeric
- **fat_per_100g**: numeric
- **fiber_per_100g**: numeric
- **sugar_per_100g**: numeric
- **sodium_per_100g**: numeric
- **serving_size_g**: numeric
- **serving_description**: text
- **confidence_score**: numeric
- **verified**: boolean
- **image_url**: text
- **source**: text
- **cuisine_type**: text
- **created_at**: timestamp
- **updated_at**: timestamp

#### `food_consumption_log`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **food_item_id**: uuid (Foreign Key → food_items.id)
- **quantity_g**: numeric
- **calories_consumed**: numeric
- **protein_consumed**: numeric
- **carbs_consumed**: numeric
- **fat_consumed**: numeric
- **meal_type**: text
- **meal_image_url**: text
- **source**: text (manual, ai_analysis)
- **ai_analysis_data**: jsonb
- **notes**: text
- **consumed_at**: timestamp
- **created_at**: timestamp

#### `subscriptions`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **stripe_customer_id**: text
- **stripe_subscription_id**: text
- **stripe_price_id**: text
- **status**: text
- **plan_type**: text
- **current_period_start**: timestamp
- **current_period_end**: timestamp
- **cancel_at_period_end**: boolean
- **trial_end**: timestamp
- **created_at**: timestamp
- **updated_at**: timestamp

#### `ai_generation_logs`
- **id**: uuid (Primary Key)
- **user_id**: uuid (Foreign Key → profiles.id)
- **generation_type**: text
- **prompt_data**: jsonb
- **response_data**: jsonb
- **status**: text
- **credits_used**: integer
- **error_message**: text
- **created_at**: timestamp

### Enums & Constants

#### `user_role`
- `normal` (default)
- `admin`
- `coach`

#### Meal Types
- `breakfast`
- `lunch`
- `dinner`
- `snack`

#### Workout Types
- `home`
- `gym`

#### Activity Levels
- `sedentary`
- `lightly_active`
- `moderately_active`
- `very_active`
- `extremely_active`

#### Fitness Goals
- `weight_loss`
- `weight_gain`
- `muscle_gain`
- `maintenance`
- `general_fitness`

## ⚙️ Edge Functions & APIs

### 1. `generate-meal-plan`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/generate-meal-plan`
- **Input**:
```json
{
  "userData": {
    "id": "uuid",
    "age": 25,
    "weight": 70,
    "height": 175,
    "gender": "male",
    "activity_level": "moderately_active",
    "dietary_restrictions": ["vegetarian"],
    "allergies": ["nuts"],
    "pregnancy_trimester": null,
    "breastfeeding_level": null,
    "fasting_type": null
  },
  "preferences": {
    "cuisine": "mediterranean",
    "maxPrepTime": "30",
    "includeSnacks": true,
    "language": "en",
    "weekOffset": 0
  }
}
```
- **Response**:
```json
{
  "success": true,
  "weeklyPlanId": "uuid",
  "weekStartDate": "2024-01-15",
  "totalMeals": 35,
  "generationsRemaining": 4,
  "includeSnacks": true,
  "mealsPerDay": 5,
  "language": "en",
  "nutritionContext": {},
  "modelUsed": { "provider": "openai", "model": "gpt-4o-mini" },
  "fallbackUsed": false,
  "message": "Meal plan generated successfully"
}
```
- **Tables**: Creates `weekly_meal_plans`, inserts multiple `daily_meals`
- **Business Logic**: 
  - Calculates daily calories based on BMR and activity level
  - Adjusts for life phases (pregnancy, breastfeeding, fasting)
  - Uses AI to generate culturally appropriate meals
  - Validates nutritional requirements

### 2. `generate-exercise-program`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/generate-exercise-program`
- **Input**:
```json
{
  "userData": {
    "userId": "uuid",
    "age": 25,
    "fitnessLevel": "beginner",
    "fitnessGoal": "weight_loss",
    "availableTime": "45",
    "injuries": [],
    "equipment": ["dumbbells", "resistance_bands"]
  },
  "preferences": {
    "workoutType": "home",
    "goalType": "weight_loss",
    "duration": "4_weeks",
    "workoutDays": "4",
    "difficulty": "beginner",
    "language": "en",
    "weekOffset": 0
  }
}
```
- **Response**:
```json
{
  "success": true,
  "programId": "uuid",
  "programName": "4-Week Home Weight Loss Program",
  "workoutType": "home",
  "weekStartDate": "2024-01-15",
  "workoutsCreated": 16,
  "exercisesCreated": 64,
  "generationsRemaining": 3,
  "message": "Exercise program generated successfully"
}
```
- **Tables**: Creates `weekly_exercise_programs`, `daily_workouts`, `exercises`
- **Business Logic**:
  - Generates progressive workout plans based on fitness level
  - Considers available equipment and time constraints
  - Creates balanced muscle group targeting
  - Includes rest days and recovery periods

### 3. `analyze-food-image`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/analyze-food-image`
- **Input**: Multipart form data with image file
- **Response**:
```json
{
  "success": true,
  "analysis": {
    "foodItems": [
      {
        "name": "Grilled Chicken Breast",
        "category": "protein",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "quantity": "100g"
      }
    ],
    "overallConfidence": 0.85,
    "cuisineType": "western",
    "suggestions": "Add vegetables for balanced nutrition"
  }
}
```
- **Tables**: May create `food_items`, `food_consumption_log`
- **Business Logic**: Uses OpenAI Vision API to analyze food images

### 4. `exchange-exercise`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/exchange-exercise`
- **Input**:
```json
{
  "exerciseId": "uuid",
  "reason": "equipment_not_available",
  "preferences": {
    "equipment": ["bodyweight"]
  },
  "userLanguage": "en",
  "userId": "uuid"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Exercise exchanged successfully",
  "newExercise": {
    "name": "Push-ups",
    "sets": 3,
    "reps": "12-15",
    "instructions": "..."
  },
  "originalExercise": "Bench Press",
  "reason": "equipment_not_available"
}
```
- **Tables**: Updates `exercises`
- **Business Logic**: AI-powered exercise substitution based on constraints

### 5. `generate-meal-alternatives`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/generate-meal-alternatives`
- **Input**:
```json
{
  "mealId": "uuid",
  "reason": "dietary_preference",
  "preferences": {
    "dietary_restrictions": ["vegan"],
    "cuisine": "mediterranean"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "alternatives": [
    {
      "name": "Mediterranean Quinoa Bowl",
      "calories": 420,
      "protein": 15,
      "carbs": 65,
      "fat": 12,
      "ingredients": [...],
      "instructions": [...]
    }
  ]
}
```
- **Tables**: May update `daily_meals`

### 6. `generate-meal-recipe`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/generate-meal-recipe`
- **Input**:
```json
{
  "mealId": "uuid",
  "userLanguage": "en"
}
```
- **Response**:
```json
{
  "success": true,
  "recipe": {
    "ingredients": [...],
    "instructions": [...],
    "prepTime": 15,
    "cookTime": 20,
    "servings": 2
  }
}
```
- **Tables**: Updates `daily_meals`

### 7. `track-exercise-performance`
- **HTTP Method**: POST
- **Endpoint**: `/functions/v1/track-exercise-performance`
- **Input**:
```json
{
  "exerciseId": "uuid",
  "userId": "uuid",
  "action": "completed",
  "progressData": {
    "sets_completed": 3,
    "reps_completed": "12"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Performance tracked successfully",
  "performanceMetrics": {
    "completion_rate": 100,
    "exceeded_target": false
  }
}
```
- **Tables**: Updates `exercises`, creates `ai_generation_logs`

## 📋 Features Implemented

### 🍽️ Meal Planning System
- **AI-Powered Generation**: Creates 7-day meal plans using OpenAI
- **Life Phase Support**: Pregnancy, breastfeeding, Islamic fasting adjustments
- **Cultural Customization**: Regional cuisine preferences and dietary restrictions
- **Nutritional Calculation**: BMR-based calorie targeting with macro distribution
- **Meal Alternatives**: AI-generated substitutions for dietary preferences
- **Recipe Generation**: Detailed cooking instructions and ingredient lists
- **Multi-language Support**: English and Arabic meal plans

### 💪 Exercise Program System
- **Progressive Programs**: 4-week structured workout plans
- **Home/Gym Variants**: Equipment-based exercise selection
- **Difficulty Scaling**: Beginner to advanced progression
- **Exercise Exchange**: AI-powered exercise substitutions
- **Progress Tracking**: Set/rep completion and performance metrics
- **Rest Day Management**: Recovery periods and active rest suggestions
- **Muscle Group Targeting**: Balanced weekly muscle group distribution

### 🤖 AI Assistant Features
- **Food Image Analysis**: Computer vision-based food identification
- **Nutrition Estimation**: Calorie and macro estimation from photos
- **Exercise Recommendations**: Personalized workout suggestions
- **Meal Suggestions**: Context-aware meal recommendations
- **Health Advice**: General fitness and nutrition guidance

### ⚖️ Weight & Progress Tracking
- **Weight Logging**: Regular weight entry with trend analysis
- **Body Composition**: Body fat percentage and muscle mass tracking
- **Progress Visualization**: Charts and graphs for progress monitoring
- **Goal Setting**: Target weight and timeline management

### 👤 Profile Management System
- **Comprehensive Profiles**: Personal, health, and preference data
- **Onboarding Flow**: Step-by-step profile completion
- **Health Assessments**: Fitness level and health condition evaluation
- **Preference Management**: Dietary, workout, and notification preferences

### 🛡️ Admin Dashboard
- **User Management**: Admin tools for user oversight
- **AI Generation Limits**: Credit system management
- **System Monitoring**: Usage analytics and performance metrics
- **Content Moderation**: Review and approve user-generated content

### 🌍 Multi-language & Localization
- **RTL Support**: Right-to-left layout for Arabic
- **Centralized Translations**: Structured translation system
- **Cultural Adaptation**: Region-specific content and recommendations
- **Date/Time Localization**: Regional format preferences

### 💳 Subscription & Limits Logic
- **Credit System**: AI generation limits for free users
- **Pro Subscriptions**: Stripe-based premium features
- **Usage Tracking**: Monitor and log AI API usage
- **Fair Use Policies**: Rate limiting and abuse prevention

## 🧰 Helper Modules & Business Logic

### Meal Planning Helpers
- **Nutrition Calculator**: BMR, TDEE, and macro calculations
- **Life Phase Processor**: Pregnancy, breastfeeding, fasting adjustments
- **Prompt Generator**: Context-aware AI prompts for meal generation
- **Meal Validator**: Nutritional requirement validation
- **Cultural Context Builder**: Regional food preferences and restrictions

### Exercise Program Helpers
- **Program Generator**: Structured workout plan creation
- **Exercise Database**: Equipment-based exercise selection
- **Progress Analytics**: Performance tracking and metrics
- **Difficulty Scaling**: Progressive overload calculations
- **Muscle Group Balancer**: Weekly muscle group distribution

### AI Integration Helpers
- **OpenAI Service**: Unified AI API interactions with fallbacks
- **Response Parser**: Structured AI response processing
- **Error Handling**: Graceful AI failure management
- **Rate Limiting**: API usage optimization
- **Multi-model Support**: OpenAI, Google, Anthropic fallback chain

### Data Validation Helpers
- **Profile Validator**: User data completeness and validity
- **Nutrition Validator**: Meal plan nutritional requirements
- **Exercise Validator**: Workout plan safety and progression
- **Input Sanitizer**: User input cleaning and validation

## 📄 Sample API Payloads

### Generate Meal Plan Request
```json
{
  "userData": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "age": 28,
    "weight": 75,
    "height": 170,
    "gender": "female",
    "activity_level": "moderately_active",
    "dietary_restrictions": ["vegetarian", "gluten_free"],
    "allergies": ["shellfish"],
    "nationality": "Saudi Arabia",
    "pregnancy_trimester": 2,
    "breastfeeding_level": null,
    "fasting_type": null,
    "fitness_goal": "maintenance"
  },
  "preferences": {
    "cuisine": "middle_eastern",
    "maxPrepTime": "45",
    "includeSnacks": true,
    "language": "ar",
    "weekOffset": 0
  }
}
```

### Generate Meal Plan Response
```json
{
  "success": true,
  "weeklyPlanId": "456e7890-e12b-34d5-a678-901234567890",
  "weekStartDate": "2024-01-15",
  "totalMeals": 35,
  "generationsRemaining": 4,
  "includeSnacks": true,
  "mealsPerDay": 5,
  "language": "ar",
  "nutritionContext": {
    "isPregnant": true,
    "pregnancyTrimester": 2,
    "extraCalories": 340,
    "specialRequirements": ["folate", "iron", "calcium"]
  },
  "modelUsed": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "responseTime": 3500
  },
  "fallbackUsed": false,
  "message": "تم إنشاء خطة الوجبات بنجاح مع مراعاة احتياجات الحمل"
}
```

### Get Workout Plan Request
```json
{
  "userData": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "age": 32,
    "fitnessLevel": "intermediate",
    "fitnessGoal": "muscle_gain",
    "availableTime": "60",
    "injuries": ["lower_back"],
    "equipment": ["dumbbells", "barbell", "bench"],
    "experience": "2_years"
  },
  "preferences": {
    "workoutType": "gym",
    "goalType": "muscle_gain",
    "duration": "4_weeks",
    "workoutDays": "5",
    "difficulty": "intermediate",
    "language": "en",
    "weekOffset": 0
  }
}
```

### Save Weight Entry Request
```json
{
  "weight": 72.5,
  "body_fat_percentage": 18.2,
  "muscle_mass": 32.1,
  "notes": "Morning weight after workout",
  "recorded_at": "2024-01-15T07:30:00Z"
}
```

### Analyze Food Image Response
```json
{
  "success": true,
  "analysis": {
    "foodItems": [
      {
        "name": "Kabsa with Chicken",
        "category": "main_dish",
        "calories": 520,
        "protein": 35,
        "carbs": 65,
        "fat": 18,
        "quantity": "1 serving (300g)",
        "confidence": 0.89
      },
      {
        "name": "Arabic Salad",
        "category": "side_dish",
        "calories": 85,
        "protein": 3,
        "carbs": 12,
        "fat": 4,
        "quantity": "1 small bowl (150g)",
        "confidence": 0.92
      }
    ],
    "overallConfidence": 0.905,
    "cuisineType": "middle_eastern",
    "mealType": "lunch",
    "suggestions": "وجبة متوازنة غذائياً، يُنصح بإضافة الفواكه كتحلية صحية",
    "totalNutrition": {
      "calories": 605,
      "protein": 38,
      "carbs": 77,
      "fat": 22
    }
  },
  "processingTime": 2800,
  "language": "ar"
}
```

## 🔧 Database Functions

### Core Functions
- `calculate_calorie_offset()`: Life phase calorie adjustments
- `check_and_use_ai_generation()`: Credit management with logging
- `calculate_profile_completion_score()`: Profile completeness scoring
- `search_food_items()`: Food database search with similarity matching
- `handle_new_user()`: Automatic profile creation on signup

### Security Functions
- `has_role()`: Role-based access control
- `is_pro_user()`: Subscription status checking
- `update_user_role()`: Admin role management
- Row Level Security policies on all user-specific tables

## 🏗️ Architecture Patterns

### API Design
- RESTful endpoints with consistent JSON responses
- Comprehensive error handling with user-friendly messages
- Multi-language error responses
- Rate limiting and credit system integration

### Data Flow
1. **User Input** → Frontend validation → API call
2. **Edge Function** → Authentication check → Business logic
3. **AI Processing** → OpenAI API → Response parsing
4. **Database Operations** → Supabase client → Response formatting
5. **Client Response** → Success/error handling → UI updates

### Security Model
- Row Level Security (RLS) on all user data tables
- JWT-based authentication through Supabase Auth
- API key protection via Supabase secrets
- Input validation and sanitization
- Role-based access control for admin features

This comprehensive backend implementation supports a full-featured fitness application with AI-powered meal planning, exercise programming, and health tracking capabilities, all built on a robust Supabase infrastructure with proper security, localization, and scalability considerations.
