
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import EnhancedPageLoading from '@/components/EnhancedPageLoading';
import ProtectedRoute from '@/components/ProtectedRoute';
import LazyPages from '@/components/LazyPages';
import { checkSecurityHeaders } from '@/components/security/InputValidator';
import './App.css';

// Create query client with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: false, // Don't retry mutations by default
      onError: (error: any) => {
        console.error('Mutation error:', error);
      }
    }
  }
});

// Check security headers on app load
if (typeof window !== 'undefined') {
  checkSecurityHeaders();
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <EnhancedErrorBoundary>
                  <Suspense 
                    fallback={
                      <EnhancedPageLoading 
                        title="Loading Application" 
                        description="Please wait while we prepare your experience..."
                        estimatedTime={3}
                      />
                    }
                  >
                    <Routes>
                      {/* Public routes */}
                      <Route 
                        path="/auth" 
                        element={
                          <ProtectedRoute 
                            requireAuth={false} 
                            preventAuthenticatedAccess={true}
                          >
                            <LazyPages.Auth />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/signup" 
                        element={
                          <ProtectedRoute 
                            requireAuth={false} 
                            preventAuthenticatedAccess={true}
                          >
                            <LazyPages.Signup />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Protected routes */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute requireAuth={true} requireProfile={true}>
                            <LazyPages.Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/meal-plan" 
                        element={
                          <ProtectedRoute requireAuth={true} requireProfile={true}>
                            <LazyPages.MealPlan />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/exercise" 
                        element={
                          <ProtectedRoute requireAuth={true} requireProfile={true}>
                            <LazyPages.Exercise />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/food-tracker" 
                        element={
                          <ProtectedRoute requireAuth={true} requireProfile={true}>
                            <LazyPages.FoodTracker />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute requireAuth={true}>
                            <LazyPages.Profile />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Admin routes */}
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requireAuth={true} requireRole="admin">
                            <LazyPages.Admin />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Coach routes */}
                      <Route 
                        path="/coach" 
                        element={
                          <ProtectedRoute requireAuth={true} requireRole={["admin", "coach"]}>
                            <LazyPages.Coach />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Default redirect */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* Catch all - redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </EnhancedErrorBoundary>
              </div>
            </Router>
            
            {/* Global toast notifications */}
            <Toaster 
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
              duration={4000}
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  color: '#1e293b'
                }
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
