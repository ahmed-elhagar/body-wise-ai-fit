
# FitFatta API Documentation 🚀

## 🎯 **Overview**

This directory contains comprehensive documentation for FitFatta's backend APIs, Edge Functions, and database schema.

---

## 🔥 **Edge Functions**

FitFatta uses **15 Supabase Edge Functions** for AI processing and business logic:

### **AI & Generation Functions**
1. **`generate-meal-plan`** - AI-powered meal plan generation with cultural preferences
2. **`generate-exercise-program`** - AI workout generation based on equipment and goals
3. **`generate-meal-recipe`** - Detailed recipe generation with instructions
4. **`generate-meal-alternatives`** - Smart meal swapping functionality
5. **`exchange-exercise`** - Alternative exercise recommendations
6. **`analyze-food-image`** - AI food photo analysis and calorie estimation
7. **`generate-ai-snack`** - Quick snack recommendations
8. **`generate-meal-image`** - AI meal image generation

### **Communication Functions**
9. **`fitness-chat`** - AI fitness coaching conversations
10. **`chat`** - General AI assistant functionality

### **Utility Functions**
11. **`shuffle-weekly-meals`** - Meal randomization within plans
12. **`send-shopping-list-email`** - Email shopping lists to users
13. **`get-exercise-recommendations`** - Exercise suggestions based on goals
14. **`track-exercise-performance`** - Workout performance logging

### **Payment Functions**
15. **`create-subscription`** - Stripe subscription creation and management

---

## 🗄️ **Database Schema**

FitFatta uses **24+ core tables** with Row Level Security (RLS):

### **User Management**
- `profiles` - Complete user profiles with life-phase support
- `onboarding_progress` - Detailed onboarding tracking
- `user_preferences` - Comprehensive preference management
- `user_roles` - Role-based access control
- `subscriptions` - Premium subscription management

### **Meal Planning & Nutrition**
- `weekly_meal_plans` - AI-generated meal plans
- `daily_meals` - Individual meal details with nutrition
- `food_items` - Comprehensive food database (verified items)
- `food_database` - General food database for searches
- `food_consumption_log` - User food intake tracking

### **Exercise & Fitness**
- `weekly_exercise_programs` - Exercise program metadata
- `daily_workouts` - Daily workout sessions
- `exercises` - Exercise database with instructions
- `weight_entries` - Body weight and composition tracking
- `user_goals` - Goal setting and progress tracking

### **AI & Analytics**
- `ai_generation_logs` - Complete AI usage tracking
- `ai_models` - AI model configuration and fallbacks
- `ai_feature_models` - Feature-specific model assignments
- `health_assessments` - Health and fitness assessments

### **Communication & Coaching**
- `coach_trainees` - Coach-trainee relationships
- `coach_trainee_messages` - Messaging system
- `coach_tasks` - Task management for coaches
- `user_notifications` - In-app notification system

---

## 🔐 **Authentication & Security**

### **Supabase Auth Integration**
- **JWT Token-based**: Secure session management
- **Row Level Security**: All tables protected with RLS policies
- **Role-based Access**: User, coach, admin role hierarchy
- **Multi-factor Auth**: Optional 2FA for enhanced security

### **API Security**
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **CORS Configuration**: Proper cross-origin setup

---

## 📊 **API Endpoints**

### **Base URL**
```
https://xnoslfftfktqvyoefccw.supabase.co/functions/v1/
```

### **Authentication**
All API calls require Authorization header:
```bash
Authorization: Bearer [JWT_TOKEN]
```

### **Common Headers**
```bash
Content-Type: application/json
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 **Key API Workflows**

### **Meal Plan Generation**
```typescript
// 1. Generate AI meal plan
POST /functions/v1/generate-meal-plan
{
  "userId": "uuid",
  "preferences": {
    "cuisine": "middle_eastern",
    "cookingSkill": "intermediate",
    "maxPrepTime": 45,
    "healthGoals": ["weight_loss"]
  }
}
```

### **Exercise Program Generation**
```typescript
// 1. Generate AI workout
POST /functions/v1/generate-exercise-program
{
  "userId": "uuid",
  "equipment": ["dumbbells", "resistance_bands"],
  "fitnessLevel": "intermediate",
  "goals": ["muscle_gain"],
  "duration": 45
}
```

### **Food Analysis**
```typescript
// 1. Analyze food photo
POST /functions/v1/analyze-food-image
{
  "userId": "uuid",
  "imageData": "base64_encoded_image",
  "mealType": "lunch"
}
```

---

## 📋 **Error Handling**

### **Standard Error Response**
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "cuisine",
      "reason": "Must be one of supported cuisine types"
    }
  }
}
```

### **HTTP Status Codes**
- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

---

## 🔄 **Rate Limiting**

### **Function Limits**
- **AI Functions**: 10 requests/minute per user
- **Data Functions**: 60 requests/minute per user
- **Utility Functions**: 30 requests/minute per user

### **Database Limits**
- **Read Operations**: 1000 requests/minute per user
- **Write Operations**: 100 requests/minute per user

---

## 🚀 **Getting Started**

### **1. Authentication Setup**
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data: { session } } = await supabase.auth.getSession();
```

### **2. Making API Calls**
```typescript
const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
  body: { userId, preferences }
});
```

### **3. Database Queries**
```typescript
const { data, error } = await supabase
  .from('weekly_meal_plans')
  .select('*')
  .eq('user_id', userId);
```

---

## 📚 **Additional Documentation**

- `database-schema.md` - Complete database schema with relationships
- `edge-functions.md` - Detailed Edge Function documentation
- `/features/` - Feature-specific API documentation

---

**Last Updated**: January 2025  
**API Version**: 2.0  
**Status**: Production Ready ✅
