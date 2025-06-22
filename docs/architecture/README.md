# 🏗️ FitFatta Architecture

FitFatta follows a modern, scalable architecture built on feature-based organization principles with enterprise-grade patterns and practices.

## 🎯 **Architectural Principles**

### **1. Feature-Based Organization**
Each feature is self-contained with its own components, hooks, services, types, and utilities:

```
src/features/[feature-name]/
├── components/          # Feature-specific UI components
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── translations/       # Feature-specific translations
└── index.ts           # Public API exports
```

### **2. Separation of Concerns**
- **Components**: Pure UI logic, minimal business logic
- **Hooks**: State management and side effects
- **Services**: API calls and data processing
- **Utils**: Pure functions and helpers
- **Types**: TypeScript definitions and interfaces

### **3. Shared Infrastructure**
Common functionality is centralized in the shared directory:

```
src/shared/
├── components/         # Reusable UI components
├── hooks/             # Generic React hooks
├── services/          # Common API services
├── types/             # Shared TypeScript types
├── utils/             # Utility functions
└── config/            # Configuration files
```

## 🏛️ **System Architecture**

### **Frontend Stack**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - High-quality component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Client state management

### **Backend Infrastructure**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Primary database
- **Row Level Security** - Data access control
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless API endpoints
- **Authentication** - Built-in auth system

### **AI Integration**
- **OpenAI GPT-4** - Primary AI provider
- **Anthropic Claude** - Secondary AI provider
- **Google AI** - Tertiary AI provider
- **Multi-provider Fallback** - Reliability system
- **Credit Management** - Usage tracking

## 📊 **Data Architecture**

### **Database Design**
FitFatta uses a normalized PostgreSQL database with 24 core tables:

#### **User Management**
- `users` - User profiles and preferences
- `user_profiles` - Extended profile information
- `user_preferences` - App settings and preferences

#### **Nutrition System**
- `food_items` - Comprehensive food database
- `food_consumption_log` - User food intake tracking
- `meal_plans` - AI-generated meal plans
- `daily_meals` - Individual meal details
- `nutrition_goals` - User nutrition targets

#### **Exercise System**
- `exercise_programs` - Workout programs
- `exercise_sessions` - Individual workout sessions
- `exercise_performance` - Performance tracking
- `exercises` - Exercise database

#### **AI & Analytics**
- `ai_generation_log` - AI usage tracking
- `user_analytics` - Behavioral analytics
- `credit_transactions` - Credit system tracking

### **Data Flow Patterns**

#### **Read Operations**
1. Component requests data via hook
2. Hook checks cache (React Query)
3. If not cached, service makes API call
4. Supabase returns data with RLS applied
5. Data is cached and returned to component

#### **Write Operations**
1. Component triggers action via hook
2. Hook validates data locally
3. Service sends data to Supabase
4. Database applies RLS and constraints
5. Real-time subscriptions notify other clients
6. UI updates optimistically

## 🔄 **State Management**

### **Server State (React Query)**
- API data caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

### **Client State (Zustand)**
- UI state management
- User preferences
- Temporary form data
- Navigation state

### **URL State (React Router)**
- Route parameters
- Query parameters
- Navigation history
- Deep linking

## 🎨 **Design System Architecture**

### **Component Hierarchy**
```
UI Components (Shadcn/UI)
    ↓
Shared Components (src/shared/components/)
    ↓
Feature Components (src/features/[feature]/components/)
    ↓
Page Components (LazyPages)
```

### **Styling Strategy**
- **Tailwind CSS** - Utility-first styling
- **CSS Variables** - Dynamic theming
- **Component Variants** - Consistent styling patterns
- **Responsive Design** - Mobile-first approach
- **RTL Support** - Arabic language support

### **Theme System**
```typescript
const theme = {
  colors: {
    primary: 'indigo',
    secondary: 'purple',
    accent: 'amber',
    neutral: 'gray'
  },
  gradients: {
    primary: 'from-indigo-500 to-purple-600',
    secondary: 'from-purple-500 to-pink-600'
  }
};
```

## 🔐 **Security Architecture**

### **Authentication Flow**
1. User signs up/in via Supabase Auth
2. JWT token is issued and stored
3. Token is included in all API requests
4. Supabase validates token and applies RLS
5. User data is returned based on permissions

### **Row Level Security (RLS)**
Every table has RLS policies that ensure:
- Users can only access their own data
- Coaches can access their trainees' data
- Admins have appropriate elevated access
- Public data is properly filtered

### **Data Validation**
- **Client-side**: Form validation with Zod
- **Server-side**: Database constraints
- **API Layer**: Input sanitization
- **Type Safety**: TypeScript compilation

## 🚀 **Performance Architecture**

### **Optimization Strategies**

#### **Code Splitting**
- Route-based lazy loading
- Feature-based code splitting
- Component-level splitting
- Dynamic imports

#### **Caching Strategy**
- React Query for server state
- Browser caching for static assets
- Service worker for offline support
- CDN for global distribution

#### **Bundle Optimization**
- Tree shaking for unused code
- Compression and minification
- Asset optimization
- Critical CSS inlining

### **Performance Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔧 **Development Architecture**

### **Build System**
- **Vite** - Fast development server
- **TypeScript** - Type checking
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Husky** - Git hooks

### **Testing Strategy**
- **Unit Tests** - Component and utility testing
- **Integration Tests** - Feature workflow testing
- **E2E Tests** - User journey testing
- **Visual Tests** - UI consistency testing

### **CI/CD Pipeline**
1. Code push triggers GitHub Actions
2. TypeScript compilation check
3. ESLint and Prettier validation
4. Test suite execution
5. Build optimization
6. Deployment to Vercel
7. Database migration (if needed)

## 🌐 **Deployment Architecture**

### **Production Environment**
- **Frontend**: Vercel (Edge Network)
- **Backend**: Supabase (Multi-region)
- **Database**: PostgreSQL (Managed)
- **CDN**: Global asset distribution
- **Monitoring**: Real-time error tracking

### **Environment Management**
- **Development**: Local Supabase instance
- **Staging**: Supabase staging project
- **Production**: Supabase production project
- **Environment Variables**: Secure configuration

## 📈 **Scalability Considerations**

### **Horizontal Scaling**
- Stateless component architecture
- API-first design patterns
- Microservice-ready structure
- Database connection pooling

### **Vertical Scaling**
- Efficient query patterns
- Optimized bundle sizes
- Memory-efficient state management
- Lazy loading strategies

### **Future Architecture**
- **Microservices**: Feature-based service splitting
- **GraphQL**: Unified API layer
- **Event Sourcing**: Audit trail and replay
- **CQRS**: Command Query Responsibility Segregation

---

**Last Updated**: January 2025  
**Architecture Version**: 2.0  
**Status**: Production Ready ✅
