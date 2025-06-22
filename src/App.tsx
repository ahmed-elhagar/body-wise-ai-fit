import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import LazyPages from '@/shared/components/LazyPages';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import ProtectedLayout from '@/components/ProtectedLayout';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';
import PerformanceDashboard from '@/shared/components/PerformanceDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const SuspenseFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <SimpleLoadingIndicator
      message="Loading Page"
      description="Please wait while we load the page..."
      size="lg"
    />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Suspense fallback={<SuspenseFallback />}>
                  <Routes>
                    {/* Public routes - No sidebar */}
                    <Route path="/" element={<LazyPages.Index />} />
                    <Route path="/landing" element={<LazyPages.Landing />} />
                    <Route path="/auth" element={<LazyPages.Auth />} />
                    <Route path="/signup" element={<LazyPages.UnifiedSignup />} />
                    <Route path="/onboarding" element={<LazyPages.Onboarding />} />
                    <Route path="/welcome" element={<LazyPages.Welcome />} />

                    {/* Protected routes - With sidebar */}
                    <Route path="/dashboard" element={
                      <ProtectedLayout>
                        <LazyPages.Dashboard />
                      </ProtectedLayout>
                    } />
                    <Route path="/profile" element={
                      <ProtectedLayout>
                        <LazyPages.Profile />
                      </ProtectedLayout>
                    } />
                    <Route path="/meal-plan" element={
                      <ProtectedLayout>
                        <LazyPages.MealPlan />
                      </ProtectedLayout>
                    } />
                    <Route path="/exercise" element={
                      <ProtectedLayout>
                        <LazyPages.Exercise />
                      </ProtectedLayout>
                    } />
                    <Route path="/food-tracker" element={
                      <ProtectedLayout>
                        <LazyPages.FoodTracker />
                      </ProtectedLayout>
                    } />
                    <Route path="/calorie-checker" element={
                      <ProtectedLayout>
                        <LazyPages.CalorieChecker />
                      </ProtectedLayout>
                    } />
                    <Route path="/weight-tracking" element={
                      <ProtectedLayout>
                        <LazyPages.WeightTracking />
                      </ProtectedLayout>
                    } />
                    <Route path="/goals" element={
                      <ProtectedLayout>
                        <LazyPages.Goals />
                      </ProtectedLayout>
                    } />
                    <Route path="/progress/:tab?" element={
                      <ProtectedLayout>
                        <LazyPages.Progress />
                      </ProtectedLayout>
                    } />
                    <Route path="/settings" element={
                      <ProtectedLayout>
                        <LazyPages.Settings />
                      </ProtectedLayout>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedLayout>
                        <LazyPages.Notifications />
                      </ProtectedLayout>
                    } />
                    <Route path="/chat" element={
                      <ProtectedLayout>
                        <LazyPages.Chat />
                      </ProtectedLayout>
                    } />
                    <Route path="/pro" element={
                      <ProtectedLayout>
                        <LazyPages.Pro />
                      </ProtectedLayout>
                    } />

                    {/* Admin & Coach routes - With sidebar and role protection */}
                    <Route path="/admin" element={
                      <ProtectedLayout requireRole="admin">
                        <LazyPages.Admin />
                      </ProtectedLayout>
                    } />
                    <Route path="/coach" element={
                      <ProtectedLayout requireRole="coach">
                        <LazyPages.Coach />
                      </ProtectedLayout>
                    } />

                    {/* 404 route */}
                    <Route path="*" element={<LazyPages.NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
                <PerformanceDashboard />
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
