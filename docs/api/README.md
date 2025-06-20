
# FitFatta AI - API Documentation

This directory contains comprehensive API documentation for all backend endpoints and services in the FitFatta AI platform.

## 📁 Documentation Structure

- `authentication.md` - User authentication and session management
- `meal-planning.md` - AI meal plan generation and management
- `exercise-programs.md` - Exercise program creation and tracking
- `food-tracking.md` - Food logging and nutrition tracking
- `ai-services.md` - AI-powered features and interactions
- `progress-tracking.md` - Weight, measurements, and progress analytics
- `coaching.md` - Coach-trainee relationships and communication
- `user-management.md` - User profiles and preferences
- `admin.md` - Administrator functionality
- `real-time.md` - WebSocket and real-time features

## 🔧 Technology Stack

- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with JWT tokens
- **AI Integration**: OpenAI GPT-4o-mini/GPT-4o + Google Gemini
- **Real-time**: Supabase Real-time subscriptions
- **File Storage**: Supabase Storage
- **Payment**: Stripe integration

## 🌐 Base URLs

- **Production**: `https://xnoslfftfktqvyoefccw.supabase.co`
- **Edge Functions**: `https://xnoslfftfktqvyoefccw.supabase.co/functions/v1/`
- **REST API**: `https://xnoslfftfktqvyoefccw.supabase.co/rest/v1/`

## 🔐 Authentication

All API requests require authentication via Supabase Auth:

```javascript
const headers = {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json',
  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhub3NsZmZ0Zmt0cXZ5b2VmY2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjgyMjksImV4cCI6MjA2Mzk0NDIyOX0.CdNxnsKk7HhLE2lhROsx6IlVn5hP94yH3XZfJoHDakQ'
}
```

## 🚀 Quick Start

1. **Set up Supabase client**:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xnoslfftfktqvyoefccw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhub3NsZmZ0Zmt0cXZ5b2VmY2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjgyMjksImV4cCI6MjA2Mzk0NDIyOX0.CdNxnsKk7HhLE2lhROsx6IlVn5hP94yH3XZfJoHDakQ'
);
```

2. **Make authenticated requests**:
```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id);
```

3. **Call Edge Functions**:
```javascript
const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
  body: { userData, preferences }
});
```

## 📊 Database Schema

The platform uses 24+ core tables:
- User management (profiles, onboarding_progress, user_preferences)
- Meal planning (weekly_meal_plans, daily_meals, food_items)
- Exercise (weekly_exercise_programs, daily_workouts, exercises)
- AI & Analytics (ai_generation_logs, ai_models)
- Communication (coach_trainees, coach_trainee_messages)

## 🔄 Real-time Features

Subscribe to real-time updates:
```javascript
const channel = supabase
  .channel('table-changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'table_name' 
  }, handleChange)
  .subscribe();
```

## 📱 Mobile Support

All APIs support React Native/Expo with:
- Offline-first data synchronization
- Background sync capabilities
- Push notification integration
- Multi-language support (EN/AR)

See individual endpoint documentation for detailed implementation examples.
