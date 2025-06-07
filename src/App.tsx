import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LazyPages } from '@/components/LazyPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Simple loading component to replace enhanced-page-loading
const SimplePageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Suspense fallback={<SimplePageLoader />}>
                  <Routes>
                    <Route path="/" element={<LazyPages.Index />} />
                    <Route path="/landing" element={<LazyPages.Landing />} />
                    <Route path="/auth" element={<LazyPages.Auth />} />
                    <Route path="/signup" element={<LazyPages.UnifiedSignup />} />
                    <Route path="/welcome" element={<LazyPages.Welcome />} />
                    <Route path="/dashboard" element={<LazyPages.Dashboard />} />
                    <Route path="/profile" element={<LazyPages.Profile />} />
                    <Route path="/meal-plan" element={<LazyPages.MealPlan />} />
                    <Route path="/exercise" element={<LazyPages.Exercise />} />
                    <Route path="/food-tracker" element={<LazyPages.FoodTracker />} />
                    <Route path="/calorie-checker" element={<LazyPages.CalorieChecker />} />
                    <Route path="/weight-tracking" element={<LazyPages.WeightTracking />} />
                    <Route path="/goals" element={<LazyPages.Goals />} />
                    <Route path="/progress" element={<LazyPages.Progress />} />
                    <Route path="/settings" element={<LazyPages.Settings />} />
                    <Route path="/notifications" element={<LazyPages.Notifications />} />
                    <Route path="/chat" element={<LazyPages.Chat />} />
                    <Route path="/pro" element={<LazyPages.Pro />} />
                    <Route path="/admin" element={<LazyPages.Admin />} />
                    <Route path="/coach" element={<LazyPages.Coach />} />
                    <Route path="*" element={<LazyPages.NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
