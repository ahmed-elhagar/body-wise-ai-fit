
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

### Feature-Based Component Structure
```typescript
// Feature-Based Component Organization
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
  maxLines: 200,
  singleResponsibility: true,
  propsInterface: 'TypeScript strict',
  stateManagement: 'React Query + Local State',
  styling: 'Tailwind CSS + shadcn/ui'
};
```

### State Management Strategy
```typescript
// State Management Architecture
interface StateManagement {
  serverState: 'React Query'; // API data, caching, synchronization
  clientState: 'React Hooks'; // UI state, form data
  globalState: 'Context API'; // User auth, language, theme
  persistentState: 'AsyncStorage'; // Offline data, user preferences
}

// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});
```

## 🔒 Security Architecture

### Authentication Flow
```
Login → Supabase Auth → JWT Token → Session Management → Protected Routes
```

### Row Level Security (RLS) Implementation
```sql
-- Example RLS Policy
CREATE POLICY "Users can only access their own data" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = id);

-- Meal Plan Access
CREATE POLICY "Users can access their meal plans" 
ON public.weekly_meal_plans 
FOR ALL 
USING (auth.uid() = user_id);

-- Admin Access Override
CREATE POLICY "Admins can access all data" 
ON public.profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
```

### API Security Layers
```typescript
// Security Validation Chain
const securityChain = [
  'CORS Headers',
  'JWT Token Validation',
  'Rate Limiting',
  'Input Sanitization',
  'RLS Policy Check',
  'Business Logic Validation',
  'Response Sanitization'
];
```

## ⚡ Performance Architecture

### Frontend Optimization
```typescript
// Performance Optimization Strategies
const performanceStrategies = {
  codesplitting: {
    implementation: 'React.lazy() + Suspense',
    routes: 'Route-based splitting',
    components: 'Heavy component lazy loading'
  },
  bundleOptimization: {
    vendorSplitting: 'Separate vendor bundles',
    treeShaking: 'Unused code elimination',
    compression: 'Gzip + Brotli'
  },
  caching: {
    reactQuery: 'Server state caching',
    browserCache: 'Static asset caching',
    serviceWorker: 'Offline functionality'
  },
  rendering: {
    memoization: 'React.memo for expensive components',
    virtualization: 'Large list optimization',
    imageOptimization: 'WebP format + lazy loading'
  }
};
```

### Database Performance
```sql
-- Query Optimization Strategies
-- 1. Proper indexing
CREATE INDEX CONCURRENTLY idx_performance_critical 
ON table_name(frequently_queried_columns);

-- 2. Query optimization
-- Use EXPLAIN ANALYZE to identify bottlenecks
EXPLAIN ANALYZE SELECT * FROM complex_query;

-- 3. Connection pooling
-- Managed automatically by Supabase

-- 4. Read replicas (future scaling)
-- Available in Supabase Pro tier
```

## 🚀 Deployment Architecture

### Current Deployment (Lovable Platform)
```
Code Changes → Git Repository → Automatic Build → CDN Deployment → Live Application
```

### Future Production Architecture
```
Development → Staging → Production
     │           │          │
     ├── Testing ├── QA     ├── Monitoring
     ├── Linting ├── E2E    ├── Analytics
     └── Building└── Load   └── Alerts
```

### Environment Management
```typescript
// Environment Configuration
const environments = {
  development: {
    supabaseUrl: 'dev-project-url',
    logLevel: 'debug',
    features: 'all-enabled'
  },
  staging: {
    supabaseUrl: 'staging-project-url',
    logLevel: 'info',
    features: 'production-like'
  },
  production: {
    supabaseUrl: 'prod-project-url',
    logLevel: 'error',
    features: 'stable-only'
  }
};
```

## 🌍 Internationalization Architecture

### Multi-Language Support
```typescript
// i18n Implementation Strategy
const i18nArchitecture = {
  framework: 'react-i18next',
  languages: ['en', 'ar'],
  rtlSupport: 'CSS logical properties',
  contentManagement: 'JSON files per feature',
  dynamicLoading: 'Lazy load language packs',
  fallbacks: 'English as default'
};

// RTL Layout Handling
const rtlOptimization = {
  cssProperties: 'margin-inline-start/end',
  flexDirection: 'Conditional row-reverse',
  textAlign: 'Dynamic based on language',
  imageFlipping: 'CSS transform for UI elements'
};
```

## 📊 Monitoring Architecture

### Application Monitoring
```typescript
// Monitoring Stack
const monitoringStack = {
  performance: {
    webVitals: 'Core Web Vitals tracking',
    bundleAnalysis: 'Webpack Bundle Analyzer',
    queryPerformance: 'React Query DevTools'
  },
  errors: {
    errorBoundaries: 'React Error Boundaries',
    logging: 'Structured logging system',
    alerting: 'Critical error notifications'
  },
  analytics: {
    userBehavior: 'Feature usage tracking',
    conversionFunnels: 'User journey analysis',
    performanceMetrics: 'Page load times'
  }
};
```

### Database Monitoring
```sql
-- Performance Monitoring Queries
-- 1. Slow query identification
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC;

-- 2. Index usage analysis
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes 
ORDER BY idx_scan ASC;

-- 3. Table size monitoring
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

This comprehensive technical architecture provides a solid foundation for scaling FitFatta from a web application to a full-featured React Native mobile application while maintaining performance, security, and reliability standards.
