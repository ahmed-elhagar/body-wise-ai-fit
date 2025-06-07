
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LazyPages } from "@/components/LazyPages";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorFallback from "@/components/ErrorFallback";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Suspense fallback={
                  <EnhancedPageLoading 
                    isLoading={true} 
                    type="general"
                    title="Loading FitGenius..."
                    description="Please wait while we prepare your experience"
                  />
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LazyPages.Index />} />
                    <Route path="/landing" element={<LazyPages.Landing />} />
                    <Route path="/auth" element={<LazyPages.Auth />} />
                    <Route path="/signup" element={<LazyPages.UnifiedSignup />} />
                    
                    {/* Protected Routes */}
                    <Route path="/welcome" element={
                      <ProtectedRoute>
                        <LazyPages.Welcome />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <LazyPages.Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <LazyPages.Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/meal-plan" element={
                      <ProtectedRoute>
                        <LazyPages.MealPlan />
                      </ProtectedRoute>
                    } />
                    <Route path="/exercise" element={
                      <ProtectedRoute>
                        <LazyPages.Exercise />
                      </ProtectedRoute>
                    } />
                    <Route path="/food-tracker" element={
                      <ProtectedRoute>
                        <LazyPages.FoodTracker />
                      </ProtectedRoute>
                    } />
                    <Route path="/calorie-checker" element={
                      <ProtectedRoute>
                        <LazyPages.CalorieChecker />
                      </ProtectedRoute>
                    } />
                    <Route path="/weight-tracking" element={
                      <ProtectedRoute>
                        <LazyPages.WeightTracking />
                      </ProtectedRoute>
                    } />
                    <Route path="/goals" element={
                      <ProtectedRoute>
                        <LazyPages.Goals />
                      </ProtectedRoute>
                    } />
                    <Route path="/progress" element={
                      <ProtectedRoute>
                        <LazyPages.Progress />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <LazyPages.Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <LazyPages.Notifications />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <LazyPages.Chat />
                      </ProtectedRoute>
                    } />
                    <Route path="/pro" element={
                      <ProtectedRoute>
                        <LazyPages.Pro />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin & Coach Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <LazyPages.Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="/coach" element={
                      <ProtectedRoute>
                        <LazyPages.Coach />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Route - catch all including /onboarding */}
                    <Route path="*" element={<LazyPages.NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
