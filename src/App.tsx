
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OptimizedLazyWrapper } from '@/components/OptimizedLazyWrapper';
import { LazyComponents, preloadCriticalComponents } from '@/utils/lazyComponentLoader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Preload critical components on app startup
  useEffect(() => {
    preloadCriticalComponents();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public routes with optimized loading */}
                  <Route 
                    path="/" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Home"
                        loadingDescription="Setting up your fitness journey..."
                      >
                        <LazyComponents.Dashboard />
                      </OptimizedLazyWrapper>
                    } 
                  />
                  
                  <Route 
                    path="/auth" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Authentication"
                        loadingDescription="Preparing login form..."
                      >
                        <LazyComponents.Auth />
                      </OptimizedLazyWrapper>
                    } 
                  />

                  {/* Protected routes with feature-specific loading */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Dashboard"
                        loadingDescription="Preparing your fitness overview..."
                      >
                        <LazyComponents.Dashboard />
                      </OptimizedLazyWrapper>
                    } 
                  />
                  
                  <Route 
                    path="/meal-plan" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Meal Plan"
                        loadingDescription="Fetching your nutrition plan..."
                      >
                        <LazyComponents.MealPlan />
                      </OptimizedLazyWrapper>
                    } 
                  />
                  
                  <Route 
                    path="/exercise" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Exercise Program"
                        loadingDescription="Preparing your workout plan..."
                      >
                        <LazyComponents.Exercise />
                      </OptimizedLazyWrapper>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Profile"
                        loadingDescription="Setting up your profile..."
                      >
                        <LazyComponents.Profile />
                      </OptimizedLazyWrapper>
                    } 
                  />

                  {/* Admin routes with separate chunk */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <OptimizedLazyWrapper 
                        loadingMessage="Loading Admin Panel"
                        loadingDescription="Accessing admin features..."
                      >
                        <LazyComponents.Admin />
                      </OptimizedLazyWrapper>
                    } 
                  />

                  {/* 404 route */}
                  <Route 
                    path="*" 
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Page Not Found
                          </h1>
                          <p className="text-gray-600">
                            The page you're looking for doesn't exist.
                          </p>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
