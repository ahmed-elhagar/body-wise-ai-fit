
# Changelog

## [2.1.0] - 2024-01-29

### Added
- 🎯 **DRY Prompt Templates**: Extracted reusable AI prompts to `src/utils/promptTemplates.ts`
- 🐛 **Debug Panel**: Admin-only debug panel with system info and logging
- 📝 **Feedback System**: In-app feedback form with Supabase storage
- 🖼️ **Image Optimization**: Thumbnail generation and image compression utilities
- 🧪 **E2E Testing**: Playwright tests for onboarding, meal plans, and credit system
- 📊 **Error Handling**: Centralized error handling with severity levels
- 📚 **Documentation**: Comprehensive README with architecture and best practices

### Improved
- ♻️ **Code Organization**: Smaller, focused components following DRY principles
- 🚀 **Performance**: Image thumbnails instead of full images in database
- 🎨 **UI/UX**: Global feedback button and improved error states
- 🔍 **Debugging**: Enhanced logging and error tracking

### Technical
- 📦 **Dependencies**: Added Playwright for E2E testing
- 🏗️ **Architecture**: Server-side business logic in Edge Functions
- 🔐 **Security**: Maintained RLS policies and data isolation
- ⚡ **Optimization**: Chunked generation (skeleton → details)

### Tests Added
- ✅ `onboarding.spec.ts` - Complete onboarding flow validation
- ✅ `meal-plan.spec.ts` - Meal generation and recipe functionality  
- ✅ `credit-system.spec.ts` - AI credit tracking and limits

### Files Modified
- `src/utils/promptTemplates.ts` - DRY prompt storage
- `src/components/DebugPanel.tsx` - Admin debugging interface
- `src/components/FeedbackForm.tsx` - User feedback collection
- `src/hooks/useImageOptimization.ts` - Image processing utilities
- `src/utils/errorHandling.ts` - Centralized error management
- `docs/README.md` - Comprehensive project documentation
- `playwright.config.ts` - E2E testing configuration

### Database Changes Required
```sql
-- User feedback table for in-app feedback system
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'feature', 'improvement', 'general')),
  message TEXT NOT NULL,
  user_email TEXT,
  page_url TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for feedback
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create feedback" ON user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON user_feedback  
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback" ON user_feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Actions Required
1. **Database Migration**: Run the SQL above to add feedback system
2. **Testing Setup**: Install Playwright with `npm install @playwright/test`
3. **Environment**: Ensure OpenAI API key is configured in Supabase secrets

---

*This release focuses on code quality, maintainability, and comprehensive testing while maintaining all existing functionality.*
