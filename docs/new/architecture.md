
# FitFatta Architecture Documentation

## System Overview
FitFatta is an AI-powered fitness and nutrition platform built with React/React Native frontend and Supabase backend services.

## Technology Stack

### Frontend
- **Web**: React 18+ with TypeScript
- **Mobile**: React Native + Expo (new implementation)
- **State Management**: React Query (@tanstack/react-query) for server state
- **UI Framework**: Tailwind CSS (web) / NativeWind (mobile)
- **Navigation**: React Router (web) / React Navigation (mobile)
- **Forms**: React Hook Form with Zod validation

### Backend Services
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (Deno runtime)

### AI Services
- **Primary**: OpenAI (GPT-4o-mini, GPT-4o)
- **Fallback**: Google Gemini, Anthropic Claude
- **Features**: Meal plan generation, exercise programs, food analysis

## Core Architecture Patterns

### 1. Feature-Based Structure
```
src/
├── features/
│   ├── meal-plan/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── exercise/
│       ├── components/
│       ├── hooks/
│       └── services/
├── components/ (shared)
├── hooks/ (global)
└── utils/ (shared)
```

### 2. Centralized AI Operations
- **Unified Loading System**: `UnifiedAILoadingDialog`
- **Credit Management**: `useCentralizedCredits`
- **Rate Limiting**: Centralized via edge functions
- **Fallback Chain**: OpenAI → Google → Anthropic

### 3. Data Flow
1. **Client** → React Query → **Supabase Client**
2. **AI Operations** → Edge Functions → **AI Providers**
3. **Real-time Updates** → Supabase Realtime → **Client State**

## Security Model

### Row Level Security (RLS)
- All tables have RLS enabled
- User-scoped data access only
- Admin role for management functions

### API Security
- JWT token validation
- Service role for edge functions
- Encrypted API keys in Supabase secrets

## Performance Optimizations

### Caching Strategy
- React Query with 30s stale time
- Optimistic updates for user actions
- Background refetching for data consistency

### AI Operations
- Credit system prevents abuse
- Response caching where appropriate
- Fallback models for reliability

## Deployment Architecture
- **Frontend**: Static hosting (Vercel/Netlify)
- **Backend**: Supabase managed infrastructure
- **Edge Functions**: Auto-deployed Deno runtime
- **Database**: Managed PostgreSQL with backups

## Error Handling
- **Global Error Boundary**: React Error Boundary
- **API Errors**: Centralized error handling hooks
- **AI Failures**: Graceful fallbacks with user feedback
- **Network Issues**: Automatic retries with exponential backoff
