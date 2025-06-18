
# FitFatta AI - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   AI Services   │
│   (React App)   │◄──►│   Backend       │◄──►│   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Frontend Architecture

### Component Organization
```
src/
├── features/           # Feature-based modules
│   ├── dashboard/     # Dashboard components
│   ├── meal-plan/     # Meal planning features
│   ├── exercise/      # Exercise program features
│   └── profile/       # User profile management
├── components/        # Shared UI components
├── hooks/            # Custom React hooks
├── pages/            # Route components
└── utils/            # Utility functions
```

### State Management Strategy
- **Server State**: React Query for caching and synchronization
- **Client State**: React hooks (useState, useContext)
- **Form State**: React Hook Form for complex forms
- **Global State**: Context providers for auth and language

### Route Structure
```
/ (landing)
├── /auth (authentication)
├── /signup (user onboarding)
├── /welcome (post-registration)
├── /dashboard (main app hub)
├── /profile (user settings)
├── /meal-plan (meal planning)
├── /exercise (workout programs)
└── /admin (administrative panel)
```

## 🔧 Backend Architecture

### Database Layer (Supabase)
```
PostgreSQL Database
├── User Management
│   ├── profiles
│   ├── user_roles
│   └── onboarding_progress
├── Meal Planning
│   ├── weekly_meal_plans
│   ├── daily_meals
│   └── food_items
├── Exercise Programs
│   ├── weekly_exercise_programs
│   ├── daily_workouts
│   └── exercises
└── Analytics
    ├── ai_generation_logs
    ├── food_consumption_log
    └── weight_entries
```

### Edge Functions
```
supabase/functions/
├── generate-meal-plan/        # AI meal plan creation
├── generate-exercise-program/ # AI workout generation
├── analyze-food-image/        # Photo nutrition analysis
├── exchange-exercise/         # Exercise alternatives
└── generate-meal-alternatives/# Meal swapping
```

### Security Model
- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **API Security**: Rate limiting and credit system
- **Data Protection**: Encrypted sensitive information

## 🤖 AI Integration Architecture

### AI Service Layer
```
AI Request → Edge Function → AI Provider → Response Processing
```

### Multi-Provider Strategy
1. **Primary**: OpenAI (GPT-4o-mini, GPT-4o)
2. **Fallback**: Google Gemini
3. **Backup**: Anthropic Claude

### Credit Management System
```
User Request → Credit Check → AI Processing → Credit Deduction → Response
```

## 🌐 Internationalization Architecture

### Language Support Structure
```
i18n/
├── en/
│   ├── common.json
│   ├── dashboard.json
│   ├── meal-plan.json
│   └── exercise.json
└── ar/
    ├── common.json
    ├── dashboard.json
    ├── meal-plan.json
    └── exercise.json
```

### RTL/LTR Handling
- CSS logical properties for layout
- Dynamic text direction switching
- Cultural-specific UI adaptations

## 📊 Data Flow Architecture

### User Registration Flow
```
User Signup → Profile Creation → Onboarding → Dashboard
```

### AI Generation Flow
```
User Request → Validation → Credit Check → AI Processing → Result Storage → UI Update
```

### Meal Plan Generation
```
User Preferences → AI Prompt → OpenAI API → Response Parsing → Database Storage → UI Display
```

## 🔒 Security Architecture

### Authentication Flow
```
Login → Supabase Auth → JWT Token → Session Management → Protected Routes
```

### Data Access Control
```
User Request → RLS Policy Check → Data Filtering → Response
```

### API Security
```
Request → Rate Limiting → Authentication → Authorization → Processing
```

## ⚡ Performance Architecture

### Frontend Optimization
- **Code Splitting**: Feature-based lazy loading
- **Bundle Optimization**: Vendor chunk splitting
- **Caching**: React Query for server state
- **Image Optimization**: WebP with fallbacks

### Backend Performance
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Edge Functions**: Global distribution
- **CDN**: Static asset delivery

## 🚀 Deployment Architecture

### Production Environment
```
Frontend (Lovable) → CDN → Users
Backend (Supabase) → Edge Functions → AI Services
```

### Development Workflow
```
Local Development → Version Control → CI/CD → Staging → Production
```

---
*Scalable, secure, and maintainable architecture for global fitness platform*
