
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/AuthGuard';
import { PageLoadingState } from '@/components/ui/enhanced-loading-states';

// Lazy load components
import { LazyPages } from '@/components/LazyPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<PageLoadingState variant="branded" />}>
                <Routes>
                  {/* Root route */}
                  <Route path="/" element={<LazyPages.Index />} />
                  
                  {/* Public routes */}
                  <Route path="/landing" element={<LazyPages.Landing />} />
                  <Route path="/auth" element={<LazyPages.Auth />} />
                  <Route path="/signup" element={<LazyPages.UnifiedSignup />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <LazyPages.Dashboard />
                    </AuthGuard>
                  } />
                  <Route path="/welcome" element={
                    <AuthGuard>
                      <LazyPages.Welcome />
                    </AuthGuard>
                  } />
                  <Route path="/profile" element={
                    <AuthGuard>
                      <LazyPages.Profile />
                    </AuthGuard>
                  } />
                  <Route path="/meal-plan" element={
                    <AuthGuard>
                      <LazyPages.MealPlan />
                    </AuthGuard>
                  } />
                  <Route path="/exercise" element={
                    <AuthGuard>
                      <LazyPages.Exercise />
                    </AuthGuard>
                  } />
                  <Route path="/food-tracker" element={
                    <AuthGuard>
                      <LazyPages.FoodTracker />
                    </AuthGuard>
                  } />
                  <Route path="/calorie-checker" element={
                    <AuthGuard>
                      <LazyPages.CalorieChecker />
                    </AuthGuard>
                  } />
                  <Route path="/weight-tracking" element={
                    <AuthGuard>
                      <LazyPages.WeightTracking />
                    </AuthGuard>
                  } />
                  <Route path="/goals" element={
                    <AuthGuard>
                      <LazyPages.Goals />
                    </AuthGuard>
                  } />
                  <Route path="/progress" element={
                    <AuthGuard>
                      <LazyPages.Progress />
                    </AuthGuard>
                  } />
                  <Route path="/settings" element={
                    <AuthGuard>
                      <LazyPages.Settings />
                    </AuthGuard>
                  } />
                  <Route path="/notifications" element={
                    <AuthGuard>
                      <LazyPages.Notifications />
                    </AuthGuard>
                  } />
                  <Route path="/chat" element={
                    <AuthGuard>
                      <LazyPages.Chat />
                    </AuthGuard>
                  } />
                  <Route path="/pro" element={
                    <AuthGuard>
                      <LazyPages.Pro />
                    </AuthGuard>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <AuthGuard requireAdmin>
                      <LazyPages.Admin />
                    </AuthGuard>
                  } />
                  <Route path="/coach" element={
                    <AuthGuard requireCoach>
                      <LazyPages.Coach />
                    </AuthGuard>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<LazyPages.NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
