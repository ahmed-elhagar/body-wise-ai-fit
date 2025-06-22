# FitFatta API Documentation 🚀

## 🎯 **Overview**

This directory contains comprehensive documentation for FitFatta's backend APIs, Edge Functions, and database schema.

---

## 🔥 **Edge Functions**

FitFatta uses **15 Supabase Edge Functions** for AI processing and business logic:

### **AI & Generation Functions**
1. **`generate-meal-plan`** - AI-powered meal plan generation with cultural preferences
2. **`generate-workout`** - AI workout generation based on equipment and goals
3. **`analyze-form`** - Exercise form analysis using computer vision
4. **`coach-chat`** - AI coaching conversation processing

### **Communication Functions**
5. **`send-shopping-list-email`** - Email shopping lists to users
6. **`send-workout-email`** - Email workout plans
7. **`send-progress-report`** - Weekly progress email reports
8. **`send-notification`** - Push notification system

### **Data Processing Functions**
9. **`process-food-data`** - Food database search and nutrition calculation
10. **`calculate-nutrition`** - Macro and micronutrient calculations
11. **`track-progress`** - Progress tracking and analytics
12. **`sync-wearable-data`** - Fitness tracker data synchronization

### **Utility Functions**
13. **`image-upload`** - Profile and progress photo upload handling
14. **`generate-report`** - PDF report generation
15. **`backup-user-data`** - User data backup and export

---

## 🗄️ **Database Schema**

FitFatta uses **24 core tables** with Row Level Security (RLS):

### **User Management (5 tables)**
- `profiles` - User profile information and preferences
- `user_preferences` - Detailed user settings and configurations
- `user_goals` - Fitness and nutrition goals
- `user_equipment` - Available exercise equipment
- `user_sessions` - Session tracking and analytics

### **Meal Planning (6 tables)**
- `meal_plans` - Weekly meal plan storage
- `daily_meals` - Individual meal records
- `recipes` - Recipe database with cultural tags
- `ingredients` - Ingredient database with nutrition data
- `shopping_lists` - Generated shopping list items
- `meal_preferences` - User dietary preferences and restrictions

### **Exercise & Fitness (6 tables)**
- `workout_plans` - AI-generated workout programs
- `exercises` - Exercise database (200+ exercises)
- `workout_sessions` - Completed workout tracking
- `exercise_logs` - Individual exercise performance
- `form_analysis` - Exercise form analysis results
- `equipment_exercises` - Exercise-equipment relationships

### **Progress Tracking (4 tables)**
- `weight_logs` - Weight tracking over time
- `body_measurements` - Body composition measurements
- `progress_photos` - Progress photo storage
- `achievement_logs` - Goal achievements and milestones

### **Communication (3 tables)**
- `chat_conversations` - AI coaching chat history
- `notifications` - System notifications
- `email_logs` - Email delivery tracking

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
https://[PROJECT-ID].supabase.co/functions/v1/
```

### **Authentication**
All API calls require Authorization header:
```bash
Authorization: Bearer [JWT_TOKEN]
```

### **Common Headers**
```bash
Content-Type: application/json
apikey: [ANON_KEY]
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

// 2. Save meal plan
POST /rest/v1/meal_plans
{
  "user_id": "uuid",
  "week_start": "2025-01-20",
  "meals": [...],
  "nutrition_totals": {...}
}
```

### **Workout Generation**
```typescript
// 1. Generate AI workout
POST /functions/v1/generate-workout
{
  "userId": "uuid",
  "equipment": ["dumbbells", "resistance_bands"],
  "fitnessLevel": "intermediate",
  "goals": ["muscle_gain"],
  "duration": 45
}

// 2. Save workout plan
POST /rest/v1/workout_plans
{
  "user_id": "uuid",
  "name": "Upper Body Strength",
  "exercises": [...],
  "estimated_duration": 45
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

## 📚 **Documentation Files**

### **Detailed Function Docs**
- `edge-functions.md` - Complete Edge Function documentation
- `database-schema.md` - Full database schema and relationships
- `authentication.md` - Auth flows and security implementation
- `api-examples.md` - Code examples and integration guides

### **Integration Guides**
- `meal-plan-api.md` - Meal planning API integration
- `workout-api.md` - Exercise API integration
- `progress-api.md` - Progress tracking API
- `chat-api.md` - AI coaching API

---

## 🚀 **Getting Started**

### **1. Authentication Setup**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://[PROJECT-ID].supabase.co',
  '[ANON-KEY]'
);
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
  .from('meal_plans')
  .select('*')
  .eq('user_id', userId);
```

---

## 🎯 **Next Steps**

1. **Detailed Function Documentation**: Complete docs for each Edge Function
2. **Schema Documentation**: Full database schema with relationships
3. **Integration Examples**: Real-world usage examples
4. **Testing Documentation**: API testing strategies and tools

---

The FitFatta API provides a comprehensive, secure, and scalable backend for delivering personalized fitness and nutrition experiences. 🚀✨ 