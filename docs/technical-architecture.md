
# FitFatta Technical Architecture Documentation

This document provides a comprehensive overview of FitFatta's technical architecture, designed to guide implementation decisions for React Native/Expo development and system scaling.

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│   React Web     │    │   React Native   │    │   Admin Panel   │
│   Application   │────│   Mobile App     │────│   Dashboard     │
│                 │    │                  │    │                 │
└─────────┬───────┘    └────────┬─────────┘    └─────────┬───────┘
          │                     │                        │
          └─────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │                        │
                    │    Supabase Backend    │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │   PostgreSQL     │  │
                    │  │   Database       │  │
                    │  └──────────────────┘  │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │   Edge Functions │  │
                    │  │   (Deno Runtime) │  │
                    │  └──────────────────┘  │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │   Auth & RLS     │  │
                    │  │   Security       │  │
                    │  └──────────────────┘  │
                    │                        │
                    └────────┬───────────────┘
                             │
                ┌────────────▼─────────────┐
                │                          │
                │   External AI Services   │
                │                          │
                │  ┌────────┐ ┌─────────┐  │
                │  │OpenAI  │ │ Google  │  │
                │  │API     │ │ Gemini  │  │
                │  └────────┘ └─────────┘  │
                │                          │
                │  ┌─────────────────────┐ │
                │  │   Anthropic Claude  │ │
                │  └─────────────────────┘ │
                │                          │
                └──────────────────────────┘
```

## 🗄️ Database Architecture

### Core Database Design Principles

1. **Feature-Based Table Organization**
2. **Normalized Schema with Strategic Denormalization**
3. **Row-Level Security (RLS) for Multi-Tenancy**
4. **Audit Trails for Critical Operations**
5. **Optimized Indexes for Query Performance**

### Data Flow Architecture
```
User Action → Frontend → Supabase Client → RLS Check → Database → Edge Function → AI Service → Response
```

### Critical Database Relationships
```sql
-- User Profile Hierarchy
profiles (1) ──→ (many) weekly_meal_plans
                        │
                        └──→ (many) daily_meals

profiles (1) ──→ (many) weekly_exercise_programs
                        │
                        └──→ (many) daily_workouts
                                   │
                                   └──→ (many) exercises

-- Tracking Relationships
profiles (1) ──→ (many) weight_entries
profiles (1) ──→ (many) food_consumption_log
profiles (1) ──→ (many) ai_generation_logs

-- Lookup Tables
food_items (1) ──→ (many) food_consumption_log
```

### Database Performance Optimization
```sql
-- Critical Indexes for Performance
CREATE INDEX CONCURRENTLY idx_weekly_meal_plans_user_date 
ON weekly_meal_plans(user_id, week_start_date DESC);

CREATE INDEX CONCURRENTLY idx_daily_meals_plan_day 
ON daily_meals(weekly_plan_id, day_number, meal_type);

CREATE INDEX CONCURRENTLY idx_exercises_workout_order 
ON exercises(daily_workout_id, order_number);

CREATE INDEX CONCURRENTLY idx_ai_logs_user_type_date 
ON ai_generation_logs(user_id, generation_type, created_at DESC);

-- Full-text search for food items
CREATE INDEX CONCURRENTLY idx_food_items_search 
ON food_items USING gin(to_tsvector('english', name || ' ' || COALESCE(brand, '')));
```

## ⚡ API Architecture

### Edge Functions Design Pattern
```typescript
// Standard Edge Function Structure
interface EdgeFunctionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    modelUsed?: string;
    creditsUsed: number;
    remainingCredits: number;
  };
}

// Error Handling Pattern
const handleEdgeFunctionError = (error: unknown, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof ValidationError) {
    return { success: false, error: error.message, statusCode: 400 };
  }
  
  if (error instanceof RateLimitError) {
    return { success: false, error: 'Rate limit exceeded', statusCode: 429 };
  }
  
  return { success: false, error: 'Internal server error', statusCode: 500 };
};
```

### API Rate Limiting Strategy
```typescript
// Multi-Tier Rate Limiting
const rateLimits = {
  free_tier: {
    ai_generations: { limit: 5, window: '24h', reset: 'daily' },
    api_calls: { limit: 1000, window: '1h' },
    file_uploads: { limit: 10, window: '1h' }
  },
  pro_tier: {
    ai_generations: { limit: -1, window: 'unlimited' }, // -1 = unlimited
    api_calls: { limit: 10000, window: '1h' },
    file_uploads: { limit: 100, window: '1h' }
  },
  admin_tier: {
    ai_generations: { limit: -1, window: 'unlimited' },
    api_calls: { limit: -1, window: 'unlimited' },
    file_uploads: { limit: -1, window: 'unlimited' }
  }
};

// Implementation in Edge Functions
const checkRateLimit = async (userId: string, operation: string) => {
  const userTier = await getUserTier(userId);
  const limits = rateLimits[userTier];
  
  if (limits[operation].limit === -1) return { allowed: true };
  
  const usage = await getUsage(userId, operation, limits[operation].window);
  return {
    allowed: usage < limits[operation].limit,
    remaining: limits[operation].limit - usage,
    resetTime: calculateResetTime(limits[operation].window)
  };
};
```

## 🤖 AI Integration Architecture

### Multi-Model Fallback System
```typescript
// AI Model Configuration
interface AIModelConfig {
  provider: 'openai' | 'google' | 'anthropic';
  modelId: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  costPerToken: number;
}

const modelChain: AIModelConfig[] = [
  {
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    maxTokens: 8000,
    temperature: 0.1,
    timeout: 30000,
    costPerToken: 0.000075
  },
  {
    provider: 'google',
    modelId: 'gemini-1.5-flash-8b',
    maxTokens: 8000,
    temperature: 0.1,
    timeout: 25000,
    costPerToken: 0.000038
  },
  {
    provider: 'anthropic',
    modelId: 'claude-3-haiku',
    maxTokens: 8000,
    temperature: 0.1,
    timeout: 35000,
    costPerToken: 0.000125
  }
];

// Intelligent Model Selection
const selectOptimalModel = async (requestType: string, userTier: string) => {
  const modelPreferences = {
    meal_plan: {
      free: modelChain.filter(m => m.costPerToken < 0.0001),
      pro: modelChain // All models available
    },
    food_analysis: {
      free: modelChain.filter(m => m.provider === 'google'),
      pro: modelChain.filter(m => m.provider === 'openai')
    }
  };
  
  return modelPreferences[requestType][userTier] || modelChain.slice(-1);
};
```

### AI Response Processing Pipeline
```typescript
// Robust AI Response Processing
class AIResponseProcessor {
  static async processResponse<T>(
    rawResponse: string,
    validator: (data: any) => data is T,
    fallbackGenerator?: () => T
  ): Promise<T> {
    
    // Stage 1: Clean response
    const cleaned = this.cleanAIResponse(rawResponse);
    
    // Stage 2: Parse JSON
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      if (fallbackGenerator) {
        console.warn('JSON parsing failed, using fallback');
        return fallbackGenerator();
      }
      throw new Error('Invalid JSON response from AI');
    }
    
    // Stage 3: Validate structure
    if (!validator(parsed)) {
      if (fallbackGenerator) {
        console.warn('Validation failed, using fallback');
        return fallbackGenerator();
      }
      throw new Error('AI response failed validation');
    }
    
    // Stage 4: Sanitize data
    return this.sanitizeData(parsed);
  }
  
  private static cleanAIResponse(response: string): string {
    return response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();
  }
  
  private static sanitizeData<T>(data: T): T {
    // Recursive sanitization logic
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item)) as T;
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    
    return data;
  }
}
```

## 📱 Frontend Architecture

### Component Architecture
```typescript
// Feature-Based Component Structure
src/features/meal-plan/
├── components/
│   ├── MealPlanHeader.tsx
│   ├── DaySelector.tsx
│   ├── MealCard.tsx
│   ├── NutritionSummary.tsx
│   └── index.ts
├── hooks/
│   ├── useMealPlanData.ts
│   ├── useMealGeneration.ts
│   └── index.ts
├── services/
│   ├── MealPlanAPI.ts
│   ├── MealValidation.ts
│   └── index.ts
├── types/
│   ├── MealPlan.ts
│   ├── Nutrition.ts
│   └── index.ts
└── index.ts (barrel exports)

// Component Design Principles
const ComponentGuidelines = {
  maxLines: 300,
  singleResponsibility: true,
  propsInterface: 'required',
  errorBoundaries: 'implemented',
  accessibility: 'WCAG_2.1_AA',
  performance: 'React.memo_when_needed'
};
```

### State Management Architecture
```typescript
// Zustand Store Structure
interface AppState {
  // User data
  user: User | null;
  profile: UserProfile | null;
  
  // Feature states
  mealPlan: MealPlanState;
  exercise: ExerciseState;
  tracking: TrackingState;
  
  // UI states
  ui: UIState;
  
  // Actions
  actions: {
    auth: AuthActions;
    mealPlan: MealPlanActions;
    exercise: ExerciseActions;
    tracking: TrackingActions;
  };
}

// React Query Integration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
        // Handle global errors
      }
    }
  }
});
```

### Performance Optimization Strategy
```typescript
// Code Splitting Strategy
const LazyComponents = {
  // Route-level splitting
  MealPlanPage: lazy(() => import('../features/meal-plan/pages/MealPlanPage')),
  ExercisePage: lazy(() => import('../features/exercise/pages/ExercisePage')),
  ProfilePage: lazy(() => import('../features/profile/pages/ProfilePage')),
  
  // Feature-level splitting
  AIAssistant: lazy(() => import('../features/ai-assistant/AIAssistant')),
  ChartComponents: lazy(() => import('../shared/components/Charts')),
  
  // Heavy components
  RichTextEditor: lazy(() => import('../shared/components/RichTextEditor')),
  VideoPlayer: lazy(() => import('../shared/components/VideoPlayer'))
};

// Virtualization for Lists
const VirtualizedList = {
  mealHistory: 'react-window',
  exerciseLibrary: 'react-virtualized',
  foodDatabase: 'react-window + infinite-loader'
};

// Image Optimization
const ImageStrategy = {
  format: 'WebP with JPEG fallback',
  sizes: ['thumb_150', 'medium_500', 'large_1200'],
  loading: 'lazy',
  placeholder: 'blur_hash'
};
```

## 🔒 Security Architecture

### Authentication & Authorization
```typescript
// Multi-Layer Security Model
const SecurityLayers = {
  authentication: {
    method: 'JWT with refresh tokens',
    provider: 'Supabase Auth',
    mfa: 'Optional TOTP',
    socialAuth: ['Google', 'Apple', 'Facebook']
  },
  authorization: {
    model: 'Role-Based Access Control (RBAC)',
    levels: ['normal', 'coach', 'admin'],
    policies: 'Row-Level Security (RLS)',
    apiKeys: 'Environment-based secrets'
  },
  dataProtection: {
    encryption: 'TLS 1.3 in transit',
    storage: 'AES-256 at rest',
    pii: 'Hashed sensitive fields',
    gdpr: 'Data anonymization support'
  }
};

// RLS Policy Pattern
const RLSPolicyExample = `
  CREATE POLICY "Users can only access their own data" ON weekly_meal_plans
    FOR ALL USING (auth.uid() = user_id);
    
  CREATE POLICY "Coaches can access trainee data" ON weekly_meal_plans
    FOR SELECT USING (
      auth.uid() = user_id OR 
      EXISTS (
        SELECT 1 FROM coach_trainees 
        WHERE coach_id = auth.uid() AND trainee_id = user_id
      )
    );
`;
```

## 📊 Monitoring & Observability

### Performance Monitoring
```typescript
// Key Performance Indicators
const PerformanceMetrics = {
  frontend: {
    firstContentfulPaint: '<1.5s',
    largestContentfulPaint: '<2.5s',
    cumulativeLayoutShift: '<0.1',
    firstInputDelay: '<100ms',
    timeToInteractive: '<3s'
  },
  backend: {
    apiResponseTime: '<500ms',
    databaseQueryTime: '<100ms',
    aiGenerationTime: '<10s',
    edgeFunctionColdStart: '<200ms',
    uptime: '>99.9%'
  },
  business: {
    userEngagement: '>60% DAU/MAU',
    aiGenerationSuccess: '>95%',
    userRetention: '>70% week 1',
    errorRate: '<0.1%',
    conversionRate: '>15% free to paid'
  }
};

// Monitoring Stack
const MonitoringTools = {
  errorTracking: 'Sentry',
  performanceAPM: 'Vercel Analytics',
  userBehavior: 'PostHog',
  logs: 'Supabase Logs',
  uptime: 'Better Stack',
  alerts: 'PagerDuty integration'
};
```

## 🚀 Scalability Architecture

### Horizontal Scaling Strategy
```typescript
// Database Scaling
const DatabaseScaling = {
  readReplicas: 'Supabase Read Replicas',
  connectionPooling: 'PgBouncer',
  caching: 'Redis for session data',
  partitioning: 'Time-based for logs and analytics',
  archival: 'Cold storage for old data'
};

// Application Scaling
const ApplicationScaling = {
  frontend: 'CDN + Edge deployment',
  api: 'Serverless auto-scaling',
  storage: 'Supabase Storage with CDN',
  search: 'PostgreSQL full-text search',
  queue: 'Supabase Edge Functions'
};

// AI Scaling
const AIScaling = {
  loadBalancing: 'Multiple AI provider fallback',
  caching: 'Response caching for common requests',
  batching: 'Batch processing for bulk operations',
  optimization: 'Model selection based on load',
  monitoring: 'Token usage and cost tracking'
};
```

## 🔧 Development Workflow

### CI/CD Pipeline
```typescript
// Deployment Strategy
const DeploymentPipeline = {
  development: {
    environment: 'Local Supabase',
    testing: 'Unit + Integration tests',
    linting: 'ESLint + Prettier',
    typeCheck: 'TypeScript strict mode'
  },
  staging: {
    environment: 'Staging Supabase project',
    testing: 'E2E tests with Playwright',
    performance: 'Lighthouse CI',
    security: 'OWASP security scan'
  },
  production: {
    environment: 'Production Supabase',
    deployment: 'Blue-green deployment',
    monitoring: 'Real-time health checks',
    rollback: 'Automated rollback on errors'
  }
};
```

This technical architecture provides a comprehensive foundation for building, scaling, and maintaining the FitFatta platform while ensuring security, performance, and reliability at scale.
