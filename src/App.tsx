
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DebugPanel from "@/components/DebugPanel";
import AuthDebugPanel from "@/components/auth/AuthDebugPanel";
import ErrorFallback from "@/components/ErrorFallback";
import { LazyPages } from "@/components/LazyPages";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Enhanced loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<LazyPages.Index />} />
                  
                  {/* Public routes */}
                  <Route 
                    path="/landing" 
                    element={
                      <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Landing />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/auth" 
                    element={
                      <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Auth />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/onboarding" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Onboarding />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Profile />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/meal-plan" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.MealPlan />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/exercise" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Exercise />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/food-tracker" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.FoodTracker />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/calorie-checker" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.CalorieChecker />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/weight-tracking" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.WeightTracking />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/goals" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Goals />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/progress" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Progress />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/progress/:tab" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Progress />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Settings />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/notifications" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Notifications />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute requireAuth={true} requireProfile={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Chat />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/pro" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Pro />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAuth={true} requireRole="admin">
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Admin />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Coach routes */}
                  <Route 
                    path="/coach" 
                    element={
                      <ProtectedRoute requireAuth={true} requireRole={["coach", "admin"]}>
                        <Suspense fallback={<PageLoader />}>
                          <LazyPages.Coach />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 route */}
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <LazyPages.NotFound />
                    </Suspense>
                  } />
                </Routes>
              </Suspense>
              
              {/* Debug panels */}
              <DebugPanel />
              <AuthDebugPanel />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
