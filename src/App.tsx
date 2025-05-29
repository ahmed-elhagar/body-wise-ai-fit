
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import Exercise from './pages/Exercise';
import WeightTracking from './pages/WeightTracking';
import CalorieChecker from './pages/CalorieChecker';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import DebugPanel from './components/DebugPanel';
import GlobalFeedbackButton from './components/GlobalFeedbackButton';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="min-h-screen bg-background">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute requireProfile>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute requireProfile>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/meal-plan" element={
                  <ProtectedRoute requireProfile>
                    <MealPlan />
                  </ProtectedRoute>
                } />
                <Route path="/exercise" element={
                  <ProtectedRoute requireProfile>
                    <Exercise />
                  </ProtectedRoute>
                } />
                <Route path="/weight-tracking" element={
                  <ProtectedRoute requireProfile>
                    <WeightTracking />
                  </ProtectedRoute>
                } />
                <Route path="/calorie-checker" element={
                  <ProtectedRoute requireProfile>
                    <CalorieChecker />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireProfile>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/admin-panel" element={
                  <ProtectedRoute requireProfile adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
              </Routes>
              
              {/* Global components */}
              <DebugPanel />
              <GlobalFeedbackButton />
              <Toaster />
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
