
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
    levels: ['normal', 'pro', 'admin', 'coach'],
    enforcement: 'Row Level Security (RLS)'
  },
  dataProtection: {
    encryption: {
      atRest: 'AES-256',
      inTransit: 'TLS 1.3',
      sensitive: 'Client-side encryption for PII'
    },
    validation: {
      input: 'Zod schema validation',
      output: 'Response sanitization',
      files: 'MIME type verification'
    }
  }
};

// RLS Policy Examples
const RLSPolicies = `
-- Users can only access their own data
CREATE POLICY user_data_policy ON profiles
FOR ALL USING (auth.uid() = id);

-- Meal plans are user-specific
CREATE POLICY meal_plan_policy ON weekly_meal_plans
FOR ALL USING (auth.uid() = user_id);

-- Admins can access all data
CREATE POLICY admin_access_policy ON profiles
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
`;
```

### API Security Implementation
```typescript
// Input Validation Schema
const ValidationSchemas = {
  mealPlanGeneration: z.object({
    userData: z.object({
      age: z.number().min(13).max(120),
      weight: z.number().min(30).max(300),
      height: z.number().min(100).max(250),
      gender: z.enum(['male', 'female', 'other']),
      activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'])
    }),
    preferences: z.object({
      cuisine: z.string().optional(),
      maxPrepTime: z.string().optional(),
      includeSnacks: z.boolean().default(true),
      language: z.enum(['en', 'ar']).default('en')
    })
  }),
  
  fileUpload: z.object({
    file: z.custom<File>((file) => {
      return file instanceof File &&
             file.size <= 10 * 1024 * 1024 && // 10MB max
             ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    }),
    purpose: z.enum(['profile_photo', 'food_analysis', 'progress_photo'])
  })
};

// Rate Limiting Implementation
const rateLimitMiddleware = async (req: Request, context: any) => {
  const userId = await getUserIdFromRequest(req);
  const endpoint = context.functionName;
  
  const rateLimitCheck = await checkRateLimit(userId, endpoint);
  
  if (!rateLimitCheck.allowed) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: rateLimitCheck.resetTime
    }), {
      status: 429,
      headers: {
        'Retry-After': rateLimitCheck.resetTime.toString(),
        'X-RateLimit-Remaining': '0'
      }
    });
  }
  
  return null; // Continue to function
};
```

## 📊 Monitoring & Observability

### Performance Monitoring Setup
```typescript
// Performance Metrics Collection
const PerformanceMonitoring = {
  frontend: {
    tools: ['Web Vitals', 'Lighthouse CI', 'Sentry Performance'],
    metrics: [
      'First Contentful Paint (FCP)',
      'Largest Contentful Paint (LCP)',
      'Cumulative Layout Shift (CLS)',
      'First Input Delay (FID)',
      'Total Blocking Time (TBT)'
    ]
  },
  backend: {
    tools: ['Supabase Dashboard', 'Custom Metrics', 'Error Tracking'],
    metrics: [
      'API Response Time',
      'Database Query Performance',
      'Edge Function Execution Time',
      'AI Model Response Time',
      'Error Rate by Endpoint'
    ]
  },
  business: {
    tools: ['PostHog', 'Google Analytics', 'Custom Dashboards'],
    metrics: [
      'User Engagement Rate',
      'Feature Adoption Rate',
      'AI Generation Success Rate',
      'Subscription Conversion Rate',
      'User Retention Cohorts'
    ]
  }
};

// Alert Configuration
const AlertingStrategy = {
  critical: {
    triggers: ['API downtime > 1min', 'Error rate > 5%', 'Payment failures'],
    channels: ['PagerDuty', 'Slack', 'Email'],
    response: 'immediate'
  },
  warning: {
    triggers: ['High response times', 'AI generation failures', 'Low conversion'],
    channels: ['Slack', 'Email'],
    response: 'within_1_hour'
  },
  info: {
    triggers: ['New user registrations', 'Feature usage spikes', 'System updates'],
    channels: ['Dashboard', 'Weekly reports'],
    response: 'review_during_business_hours'
  }
};
```

## 🚀 Deployment & Infrastructure

### CI/CD Pipeline Architecture
```yaml
# .github/workflows/deploy.yml
name: FitFatta Deployment Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run build
      - run: npm run lighthouse:ci

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - run: npm run security:scan
      - run: npm run dependency:check

  deploy-staging:
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy:staging
      - run: npm run test:staging

  deploy-production:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy:production
      - run: npm run test:production
      - run: npm run notify:deployment
```

### Infrastructure Scaling Strategy
```typescript
// Auto-Scaling Configuration
const InfrastructureConfig = {
  database: {
    primary: 'Supabase Pro',
    readReplicas: 'Auto-scale based on load',
    caching: 'Redis for session and API responses',
    backup: 'Daily automated backups with point-in-time recovery'
  },
  
  edgeFunctions: {
    concurrency: 'Auto-scale up to 1000 concurrent executions',
    regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    timeout: '60 seconds for AI functions, 30 seconds for others',
    memory: '512MB standard, 1GB for AI processing'
  },
  
  cdn: {
    provider: 'Cloudflare',
    caching: 'Static assets cached for 1 year',
    compression: 'Brotli and Gzip',
    optimization: 'Auto-minification and image optimization'
  },
  
  monitoring: {
    uptime: 'UptimeRobot for external monitoring',
    performance: 'New Relic for application performance',
    logs: 'Centralized logging with structured queries',
    alerts: 'PagerDuty for critical issues'
  }
};

// Disaster Recovery Plan
const DisasterRecovery = {
  backupStrategy: {
    database: 'Continuous backup with 1-hour point-in-time recovery',
    files: 'Daily backup of user uploads to separate cloud storage',
    configuration: 'Infrastructure as Code with version control'
  },
  
  recoveryProcedures: {
    rto: '4 hours maximum recovery time',
    rpo: '1 hour maximum data loss',
    testing: 'Monthly disaster recovery drills',
    documentation: 'Step-by-step recovery runbooks'
  }
};
```

This technical architecture provides a solid foundation for building a scalable, secure, and maintainable fitness platform that can grow from thousands to millions of users while maintaining high performance and reliability.
