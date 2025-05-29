
# 🏋️ AI Fitness Companion

An AI-powered fitness app that provides personalized meal plans and exercise programs using OpenAI GPT-4o and Supabase.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd fitness-app
   npm install
   ```

2. **Environment Setup**
   - Connect to Supabase via Lovable interface
   - Add OpenAI API key in Supabase Edge Function Secrets
   - Run database migrations

3. **Development**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: OpenAI GPT-4o for meal & exercise generation
- **State Management**: TanStack Query + Context API

### Core Features
- **Onboarding**: Multi-step user profile setup
- **Meal Plans**: AI-generated weekly meal skeletons
- **Recipe Generation**: On-demand detailed recipes
- **Exercise Programs**: Personalized workout plans
- **Weight Tracking**: Progress monitoring
- **Credit System**: 5 AI generations per user

## 🔄 Data Flow

### Meal Plan Generation
1. **Skeleton First**: Generate 7-day meal overview (names, calories, basic nutrition)
2. **Recipe on Demand**: Fetch detailed ingredients/instructions when needed
3. **Caching**: Store recipes to avoid regeneration

### Credit System
- Each AI generation (meal plan, exercise program, recipe) costs 1 credit
- Users start with 5 credits
- Admins can reset credits via admin panel

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Coverage
- Onboarding flow validation
- Meal plan generation (with/without snacks)
- Recipe caching behavior
- Credit system enforcement

## 📝 Best Practices

### Prompt Engineering
- Keep prompts explicit and concise
- Use JSON-only responses
- Store reusable prompts in `src/utils/promptTemplates.ts`

### Performance
- Images stored as thumbnails in DB
- Chunked generation (skeleton → details)
- Optimistic UI updates

### Error Handling
- Centralized error handling in `src/utils/errorHandling.ts`
- User-friendly error messages
- Debug panel for admins

### Code Organization
- Small, focused components
- Custom hooks for business logic
- Separation of concerns (UI vs logic)

## 🔧 Configuration

### Environment Variables
Set in Supabase Edge Function Secrets:
- `OPENAI_API_KEY`: For AI generation

### Database Schema
Key tables:
- `profiles`: User data & preferences
- `weekly_meal_plans`: Meal plan skeletons
- `daily_meals`: Individual meals with recipes
- `weekly_exercise_programs`: Workout plans
- `user_feedback`: In-app feedback

## 🚀 Deployment

1. **Supabase Setup**
   - Configure RLS policies
   - Deploy edge functions
   - Set up secrets

2. **Frontend Deployment**
   - Build: `npm run build`
   - Deploy via Lovable's publish feature

## 🐛 Debugging

- **Debug Panel**: Admin-only panel (bottom-right corner)
- **Console Logs**: Extensive logging in development
- **Error Tracking**: Centralized error handling
- **Feedback Form**: In-app user feedback system

## 📊 Monitoring

- AI generation success rates
- User onboarding completion
- Credit usage patterns
- Performance metrics

## 🔐 Security

- Row Level Security (RLS) on all tables
- API key security via Supabase secrets
- User data isolation
- Admin role verification

## 🎯 Future Enhancements

- Push notifications for meal reminders
- Social features (sharing meals/workouts)
- Integration with fitness trackers
- Advanced nutrition analysis
- Meal photo recognition

---

For technical support or feature requests, use the in-app feedback form or contact the development team.
