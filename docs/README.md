
# FitGenius - AI-Powered Fitness Companion

## 🚀 Project Overview

FitGenius is a comprehensive AI-powered fitness companion that leverages cloud-based AI models to provide personalized meal plans, exercise programs, and wellness features for users worldwide.

## ✨ Key Features

### 🍽️ Smart Meal Planning
- **AI-Generated Weekly Plans**: Personalized 7-day meal plans with cultural adaptability
- **Skeleton-First Approach**: Quick plan generation followed by detailed recipes on-demand
- **Smart Shopping Lists**: Automatically generated from meal plans
- **Meal Exchange System**: Swap meals while maintaining nutritional balance
- **Snack Management**: Add custom snacks to daily plans

### 🏋️ Exercise Programs
- **Personalized Workouts**: AI-generated exercise routines based on goals and equipment
- **YouTube Integration**: Exercise tutorial links for proper form
- **Progress Tracking**: Monitor workout completion and improvements
- **Flexible Programs**: Adaptable to user's fitness level and time constraints

### 📊 Health Tracking
- **Weight Management**: Track weight, body fat, and muscle mass
- **Nutrition Analysis**: Detailed calorie and macro tracking
- **Photo Food Analysis**: AI-powered calorie estimation from meal photos
- **Progress Visualization**: Charts and graphs for long-term insights

### 🌐 Internationalization
- **Multi-Language Support**: English and Arabic with RTL layout support
- **Cultural Cuisine Integration**: Meal plans adapted to user's nationality
- **Localized User Experience**: Date formats, number systems, and cultural preferences

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive, modern styling
- **Shadcn/UI** for consistent component library
- **React Query** for efficient data fetching and caching
- **React Router** for client-side navigation

### Backend & AI
- **Supabase** for database, authentication, and edge functions
- **OpenAI GPT-4o** for meal plan and exercise generation
- **PostgreSQL** with Row Level Security (RLS)
- **Edge Functions** for server-side AI processing

### Key Integrations
- **OpenAI API**: For AI-powered content generation
- **Supabase Storage**: For user-uploaded images
- **YouTube API**: For exercise tutorial integration

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI base components
│   ├── meal-plan/      # Meal planning specific components
│   ├── exercise/       # Exercise related components
│   └── onboarding/     # User onboarding flow
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── contexts/           # React context providers
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
└── integrations/       # External service integrations

supabase/
├── functions/          # Edge functions for AI processing
└── migrations/         # Database schema migrations
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Supabase account
- OpenAI API key

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fitgenius
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   npx supabase db reset
   ```

4. **Configure Secrets in Supabase**
   - Add `OPENAI_API_KEY` in Supabase Dashboard → Settings → Edge Functions

5. **Start Development**
   ```bash
   npm run dev
   ```

## 🎯 Core User Flow

1. **Onboarding**: User completes profile setup (health metrics, goals, preferences)
2. **AI Generation**: System generates personalized meal plans and exercise programs
3. **Daily Usage**: Users view daily meals, track progress, exchange items
4. **Recipe Details**: On-demand detailed recipe generation with instructions
5. **Progress Tracking**: Weight entries, photo analysis, goal monitoring

## 🔧 Configuration

### AI Generation Limits
- New users receive 5 AI generations
- Admins can reset user limits
- Credit system prevents API abuse

### Meal Plan System
- **Skeleton Generation**: Quick 7-day meal outlines
- **Recipe Enhancement**: Detailed instructions generated on-demand
- **Cultural Adaptation**: Cuisine preferences by nationality
- **Nutritional Balance**: Macro and calorie distribution

### Security Features
- Row Level Security (RLS) on all user data
- Authentication required for all data access
- Admin-only functions for user management
- Secure API key handling in edge functions

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interactions
- Optimized layouts for all screen sizes
- RTL language support for Arabic

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run specific test suites
npm run test:onboarding
npm run test:meal-plan
npm run test:credits
```

## 🚀 Deployment

### Supabase Deployment
1. Push database changes: `npx supabase db push`
2. Deploy edge functions: `npx supabase functions deploy`

### Frontend Deployment
The app can be deployed to any static hosting provider:
- Vercel, Netlify, or similar
- Ensure environment variables are configured
- Set up custom domain if needed

## 🔍 Debugging

### Debug Panel
- Available in development mode
- Shows authentication status, profile data, system info
- Admin users can access in production
- Clear data functionality for testing

### Common Issues
- **Authentication Errors**: Check Supabase URL configuration
- **AI Generation Fails**: Verify OpenAI API key in Supabase secrets
- **RLS Errors**: Ensure user is authenticated and has proper permissions

## 📊 Monitoring

### Performance Tracking
- React Query dev tools for cache inspection
- Console logging for AI generation flow
- Error boundary for graceful error handling

### User Feedback
- In-app feedback form stores to Supabase
- Categorized feedback for better organization
- Admin panel for feedback management

## 🤝 Contributing

1. Follow the established code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test thoroughly before submitting
5. Follow the existing naming conventions

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Check the debug panel for system status
- Use the in-app feedback form
- Review console logs for error details
- Consult Supabase dashboard for database issues
