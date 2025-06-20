
# FitFatta AI - API Documentation

This directory contains comprehensive API documentation for all backend endpoints and services in the FitFatta AI platform.

## 📁 Documentation Structure

- `authentication.md` - User authentication and session management
- `meal-planning.md` - AI meal plan generation and management
- `exercise-programs.md` - Exercise program creation and tracking
- `food-tracking.md` - Food logging and nutrition tracking
- `ai-services.md` - AI-powered features and interactions
- `progress-tracking.md` - Weight, measurements, goals, and achievements
- `coaching.md` - Coach-trainee relationships and communication
- `admin.md` - Administrator functionality and system management
- `user-management.md` - User profiles and preferences
- `real-time.md` - WebSocket and real-time features

## 🔧 Technology Stack

- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with JWT tokens
- **AI Integration**: OpenAI GPT-4o-mini/GPT-4o + Google Gemini + Anthropic Claude
- **Real-time**: Supabase Real-time subscriptions
- **File Storage**: Supabase Storage
- **Payment**: Stripe integration
- **Edge Functions**: 15+ specialized functions

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

The platform uses 24+ core tables organized into categories:

### User Management
- `profiles` - Complete user profiles with life-phase support
- `onboarding_progress` - Detailed onboarding tracking
- `user_preferences` - Comprehensive preference management
- `user_roles` - Role-based access control
- `subscriptions` - Premium subscription management

### Meal Planning & Nutrition
- `weekly_meal_plans` - AI-generated meal plans
- `daily_meals` - Individual meal details with nutrition
- `food_items` - Comprehensive food database (10,000+ items)
- `food_consumption_log` - User food intake tracking
- `food_search_history` - Search optimization data

### Exercise & Fitness
- `weekly_exercise_programs` - Exercise program metadata
- `daily_workouts` - Daily workout sessions
- `exercises` - Exercise database with instructions
- `weight_entries` - Body weight and composition tracking
- `user_goals` - Goal setting and progress tracking

### AI & Analytics
- `ai_generation_logs` - Complete AI usage tracking
- `ai_models` - AI model configuration and fallbacks
- `ai_feature_models` - Feature-specific model assignments
- `health_assessments` - Health and fitness assessments

### Communication & Coaching
- `coach_trainees` - Coach-trainee relationships
- `coach_trainee_messages` - Messaging system
- `coach_tasks` - Task management for coaches
- `user_notifications` - In-app notification system

### System Management
- `user_feedback` - User satisfaction tracking
- `audit_logs` - Admin action logging
- `active_sessions` - Session management

## 🔧 Edge Functions (15 Functions)

### AI Generation Functions
- `generate-meal-plan` - Personalized meal planning with cultural adaptation
- `generate-exercise-program` - AI workout program generation
- `generate-meal-recipe` - Detailed recipe generation
- `generate-meal-alternatives` - Smart meal swapping
- `exchange-exercise` - Alternative exercise recommendations
- `analyze-food-image` - AI food photo analysis
- `generate-ai-snack` - Quick snack recommendations
- `generate-meal-image` - AI meal image generation

### Communication Functions
- `fitness-chat` - AI fitness coaching conversations
- `chat` - General AI assistant

### Utility Functions
- `shuffle-weekly-meals` - Meal randomization
- `send-shopping-list-email` - Email shopping lists
- `get-exercise-recommendations` - Exercise suggestions
- `track-exercise-performance` - Workout logging

### Payment & Admin Functions
- `create-subscription` - Stripe subscription creation
- `admin-cancel-subscription` - Admin subscription management

## ✨ Core Features

### 🍽️ Smart Meal Planning
- AI-generated 7-day meal plans with cultural adaptability
- Nutrition optimization with macro tracking
- Life-phase adjustments (pregnancy, breastfeeding, fasting)
- Smart shopping list generation
- Meal exchange system maintaining nutritional balance

### 🏋️ Exercise Programs
- Personalized AI workout routines (home/gym variants)
- YouTube integration for exercise tutorials
- Progressive overload and difficulty scaling
- Performance tracking and workout completion
- Exercise alternatives with muscle group targeting

### 📊 Health Tracking
- Comprehensive weight and body composition monitoring
- AI-powered food photo analysis and calorie estimation
- Goal setting and progress visualization
- Health assessments and fitness scoring

### 🌐 Global Accessibility
- Multi-language support (English/Arabic) with RTL layout
- Cultural cuisine adaptation by nationality
- Religious dietary considerations (Halal, Kosher)
- Regional ingredient availability

### 👥 Professional Tools
- Coach-trainee relationship management
- Progress monitoring and communication tools
- Task assignment and completion tracking
- Professional dashboard with client analytics

### 🤖 AI Assistant
- Context-aware fitness and nutrition coaching
- Multi-language responses with cultural sensitivity
- Conversation history and personalized recommendations
- Credit-based usage system with subscription tiers

### 👨‍💼 Admin Features
- Complete user management and role assignment
- System health monitoring and analytics
- AI model management and configuration
- Subscription and payment management
- Comprehensive audit logging

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

### Available Real-time Channels
- User presence and online status
- Coach-trainee messaging
- Progress updates and achievements
- Workout session tracking
- Meal plan updates

## 📱 Mobile Support

All APIs support React Native/Expo with:
- Offline-first data synchronization
- Background sync capabilities
- Push notification integration
- Multi-language support (EN/AR)
- Cultural adaptation

## 🔒 Security & Performance

### Security Features
- Row Level Security (RLS) on all database tables
- JWT token authentication with refresh tokens
- API key protection via Supabase secrets
- Rate limiting and credit management system
- Admin role-based access control

### Performance Optimizations
- React Query for efficient data caching
- Optimized database queries with proper indexing
- Code splitting and lazy loading
- Real-time subscriptions for live updates
- Progressive Web App (PWA) capabilities

## 📈 Analytics & Monitoring

### User Analytics
- Feature usage tracking and engagement metrics
- Conversion funnel analysis for key user journeys
- AI generation success rates and user satisfaction
- Performance metrics and error tracking

### System Monitoring
- Edge function performance and error rates
- Database query optimization and indexing
- Real-time user presence and activity tracking
- Comprehensive logging for debugging and analytics

## 🌍 Cultural & Multi-Language Support

### Supported Languages
- **English** (`en`) - Default language
- **Arabic** (`ar`) - RTL support with cultural context

### Cultural Adaptations
- Middle Eastern cuisine preferences
- Religious dietary considerations
- Regional cooking methods and ingredients
- Cultural meal timing and preferences

## 📖 API Documentation Sections

1. **[Authentication](authentication.md)** - Complete auth system with OAuth support
2. **[Meal Planning](meal-planning.md)** - AI-powered meal generation and management
3. **[Exercise Programs](exercise-programs.md)** - Workout creation and tracking
4. **[Food Tracking](food-tracking.md)** - Nutrition logging and analysis
5. **[AI Services](ai-services.md)** - AI chat, image analysis, and content generation
6. **[Progress Tracking](progress-tracking.md)** - Goals, achievements, and analytics
7. **[Coaching](coaching.md)** - Coach-trainee relationship management
8. **[Admin](admin.md)** - Platform administration and management
9. **[User Management](user-management.md)** - Profile and preference management
10. **[Real-time](real-time.md)** - WebSocket features and live updates

Each section provides detailed endpoint documentation, request/response examples, error handling, and integration guides.
