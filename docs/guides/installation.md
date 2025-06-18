
# Installation Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm or bun** package manager
- **Git** for version control
- **Supabase account** ([Sign up](https://supabase.com))
- **OpenAI API key** ([Get key](https://platform.openai.com))

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitfatta-ai
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration

#### Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Note your project URL and anon key

#### Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run database migrations
supabase db reset
```

### 4. Configure Secrets
In Supabase Dashboard → Settings → Edge Functions:
```
OPENAI_API_KEY=your_openai_api_key
```

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app running.

## 🔧 Advanced Setup

### Custom Domain (Production)
1. Configure custom domain in hosting provider
2. Update CORS settings in Supabase
3. Configure redirect URLs for authentication

### Environment Variables Reference
```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_ENABLE_DEBUG_PANEL=true
VITE_DEFAULT_LANGUAGE=en
```

### Development vs Production
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Production deployment handled by hosting provider
```

## 🧪 Verification

### Test Core Features
1. **Registration**: Create new user account
2. **Authentication**: Login and logout
3. **Profile**: Complete user profile setup
4. **AI Generation**: Generate meal plan (requires OpenAI key)
5. **Language Switch**: Toggle between English/Arabic

### Health Check
```bash
# Check database connection
npm run db:check

# Verify environment variables
npm run env:check

# Run test suite
npm test
```

## 🔒 Security Setup

### Database Security
- All tables use Row Level Security (RLS)
- Authentication required for data access
- Admin-only functions protected by role checks

### API Security
- OpenAI API key stored in Supabase secrets
- Rate limiting on AI generation endpoints
- Credit system prevents abuse

### Client Security
- No sensitive data in client-side code
- JWT tokens for authentication
- HTTPS enforced in production

## 📱 Mobile Setup (Future)

### Progressive Web App
- PWA configuration included
- Offline functionality planned
- Mobile-optimized UI

### React Native (Planned)
- Shared business logic
- Native mobile features
- Platform-specific optimizations

## 🆘 Troubleshooting

### Common Installation Issues

#### Node Version Errors
```bash
# Use Node Version Manager
nvm install 18
nvm use 18
```

#### Supabase Connection Issues
```bash
# Verify project connection
supabase status

# Check environment variables
echo $VITE_SUPABASE_URL
```

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Getting Help
- Check the [Troubleshooting Guide](../operations/troubleshooting.md)
- Review console logs for error details
- Verify all environment variables are set correctly

---
*Complete setup in under 10 minutes!*
