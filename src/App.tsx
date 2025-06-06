
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import { Toaster } from "@/components/ui/sonner"

const Index = lazy(() => import("@/pages/Index"));
const LandingPage = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const EnhancedOnboarding = lazy(() => import("@/pages/EnhancedOnboarding"));
const MealPlan = lazy(() => import("@/pages/MealPlan"));
const Exercise = lazy(() => import("@/pages/Exercise"));
const Settings = lazy(() => import("@/pages/Settings"));
const Chat = lazy(() => import("@/pages/Chat"));
const OnboardingSuccess = lazy(() => import("@/pages/OnboardingSuccess"));
const EnhancedOnboardingWithRegistration = lazy(() => import("@/pages/EnhancedOnboardingWithRegistration"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<div>Loading...</div>}>
                <Index />
              </Suspense>
            } />
            <Route path="/landing" element={
              <Suspense fallback={<div>Loading...</div>}>
                <LandingPage />
              </Suspense>
            } />
            <Route path="/auth" element={
              <Suspense fallback={<div>Loading...</div>}>
                <Auth />
              </Suspense>
            } />
            <Route path="/onboarding" element={
              <Suspense fallback={<div>Loading...</div>}>
                <Onboarding />
              </Suspense>
            } />
            <Route path="/enhanced-onboarding" element={
              <Suspense fallback={<div>Loading...</div>}>
                <EnhancedOnboarding />
              </Suspense>
            } />
            <Route path="/onboarding-with-registration" element={
              <Suspense fallback={<div>Loading...</div>}>
                <EnhancedOnboardingWithRegistration />
              </Suspense>
            } />
            <Route path="/onboarding-success" element={
              <Suspense fallback={<div>Loading...</div>}>
                <OnboardingSuccess />
              </Suspense>
            } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Dashboard />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-plan"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <MealPlan />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercise"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Exercise />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Settings />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Chat />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
