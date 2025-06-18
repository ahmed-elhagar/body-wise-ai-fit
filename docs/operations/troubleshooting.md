
# Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Authentication Issues

#### "useAuth must be used within AuthProvider" Error
**Cause**: Component using auth hook outside provider context
**Solution**:
```tsx
// Ensure AuthProvider wraps your app
<AuthProvider>
  <LanguageProvider>
    <App />
  </LanguageProvider>
</AuthProvider>
```

#### Session Not Persisting
**Cause**: Browser storage issues or configuration problems
**Solutions**:
1. Clear browser localStorage/sessionStorage
2. Check Supabase URL configuration
3. Verify auth redirect URLs

### AI Generation Issues

#### "Insufficient Credits" Error
**Cause**: User has no remaining AI generations
**Solutions**:
1. Admin can reset credits via admin panel
2. Check `ai_generations_remaining` in profiles table
3. Verify credit deduction logic in edge functions

#### AI Generation Timeout
**Cause**: AI provider API delays or failures
**Solutions**:
1. Check OpenAI API status
2. Verify API keys in Supabase secrets
3. Review edge function logs
4. Test fallback providers (Gemini, Claude)

### Database Issues

#### RLS Policy Denying Access
**Cause**: Missing or incorrect Row Level Security policies
**Solutions**:
1. Check if user is authenticated: `auth.uid()`
2. Verify RLS policies exist for the table
3. Test policy logic with sample data
4. Review user_id references in policies

#### Query Performance Issues
**Cause**: Missing indexes or inefficient queries
**Solutions**:
1. Add indexes for frequently queried columns
2. Use `EXPLAIN ANALYZE` to identify bottlenecks
3. Optimize join operations
4. Consider pagination for large datasets

### Frontend Issues

#### Component Not Rendering
**Cause**: Various React-related issues
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify component imports and exports
3. Ensure proper prop types
4. Check conditional rendering logic

#### Slow Page Loading
**Cause**: Large bundle size or inefficient code
**Solutions**:
1. Implement code splitting with `React.lazy()`
2. Optimize images (WebP format, compression)
3. Add `React.memo()` for expensive components
4. Review bundle analyzer output

### Internationalization Issues

#### Text Not Translating
**Cause**: Missing translation keys or i18n setup
**Solutions**:
1. Verify translation key exists in language files
2. Check `useI18n()` hook implementation
3. Ensure language switcher works properly
4. Run `npm run i18n:extract` to find missing keys

#### RTL Layout Problems
**Cause**: CSS not supporting right-to-left languages
**Solutions**:
1. Use CSS logical properties (`margin-inline-start`)
2. Add RTL-specific classes conditionally
3. Test layout in Arabic language
4. Use flexbox with `flex-direction: row-reverse`

## 🔍 Debugging Tools

### Browser DevTools
```javascript
// Check authentication status
console.log('Auth user:', supabase.auth.getUser());

// Verify translation loading
console.log('Current language:', i18n.language);
console.log('Available translations:', i18n.getResourceBundle());

// Monitor React Query cache
// Open React Query DevTools in development
```

### Supabase Debugging
```sql
-- Check user data
SELECT * FROM profiles WHERE id = 'user-uuid';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'table_name';

-- Check recent AI generations
SELECT * FROM ai_generation_logs 
WHERE user_id = 'user-uuid' 
ORDER BY created_at DESC LIMIT 10;
```

### Edge Function Debugging
```typescript
// Add detailed logging in edge functions
console.log('Request received:', req.method, req.url);
console.log('Request body:', await req.json());
console.log('Processing with user:', userId);
console.log('AI response:', aiResponse);
```

## 📊 Monitoring & Alerts

### Key Metrics to Monitor
- **Error Rate**: JavaScript errors and API failures
- **Response Time**: Page load and API response times
- **User Authentication**: Login success/failure rates
- **AI Generation Success**: Success rate by provider
- **Database Performance**: Query execution times

### Log Analysis
```bash
# Edge function logs
supabase functions logs --function-name generate-meal-plan

# Database slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC;
```

## 🆘 Emergency Procedures

### Service Outage Response
1. **Immediate**: Check Supabase dashboard for service status
2. **Notify**: Alert users via in-app notification
3. **Investigate**: Review logs and error reports
4. **Communicate**: Update status page with progress
5. **Resolve**: Apply fixes and verify functionality
6. **Post-Mortem**: Document incident and prevention measures

### Data Recovery
1. **Assessment**: Determine scope of data loss
2. **Backup**: Use Supabase point-in-time recovery
3. **Validation**: Verify data integrity after recovery
4. **Communication**: Inform affected users
5. **Prevention**: Review and improve backup procedures

### Security Incident Response
1. **Isolation**: Immediately secure compromised systems
2. **Assessment**: Determine impact and exposure
3. **Containment**: Prevent further damage
4. **Recovery**: Restore secure operations
5. **Communication**: Notify users if data affected
6. **Review**: Strengthen security measures

## 📞 Getting Help

### Internal Resources
- **Developer Documentation**: `/docs` folder
- **Code Comments**: Inline documentation
- **Git History**: Previous fixes and changes
- **Debug Panel**: Available in development mode

### External Resources
- **Supabase Documentation**: https://supabase.io/docs
- **React Documentation**: https://react.dev
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Support Channels
- **Technical Issues**: Check console logs and error messages
- **Feature Requests**: Use in-app feedback form
- **Bug Reports**: Include reproduction steps and environment details

---
*When in doubt, check the logs first!*
