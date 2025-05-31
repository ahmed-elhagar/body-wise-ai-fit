
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import Exercise from './pages/Exercise';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Coach from './pages/Coach';
import Pro from './pages/Pro';
import CalorieChecker from './pages/CalorieChecker';
import AIChatPage from './pages/AIChatPage';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import FoodTracker from './pages/FoodTracker';
import { Toaster } from "@/components/ui/sonner"
import './i18n/config';
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LanguageProvider>
            <div className="min-h-screen flex w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meal-plan" element={<MealPlan />} />
                <Route path="/exercise" element={<Exercise />} />
                <Route path="/food-tracker" element={<FoodTracker />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/progress/:tab" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
                {/* Redirect old routes to new structure */}
                <Route path="/weight-tracking" element={<Navigate to="/progress/weight" replace />} />
                <Route path="/goals" element={<Navigate to="/progress/goals" replace />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/coach/trainees" element={<Coach />} />
                <Route path="/coach/settings" element={<Coach />} />
                <Route path="/pro" element={<Pro />} />
                <Route path="/calorie-checker" element={<CalorieChecker />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dashboard" element={<Admin />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </LanguageProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
