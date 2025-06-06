
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/enhanced-onboarding" element={<EnhancedOnboarding />} />
            <Route path="/onboarding-with-registration" element={<EnhancedOnboardingWithRegistration />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
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
