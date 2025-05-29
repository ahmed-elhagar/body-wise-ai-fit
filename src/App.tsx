import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/hooks/useAuth';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import Exercise from './pages/Exercise';
import WeightTracking from './pages/WeightTracking';
import CalorieChecker from './pages/CalorieChecker';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import AdminPanel from './pages/AdminPanel';
import DebugPanel from './components/DebugPanel';
import GlobalFeedbackButton from './components/GlobalFeedbackButton';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="min-h-screen bg-background">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/meal-plan" element={<MealPlan />} />
                  <Route path="/exercise" element={<Exercise />} />
                  <Route path="/weight-tracking" element={<WeightTracking />} />
                  <Route path="/calorie-checker" element={<CalorieChecker />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/admin-panel" element={<AdminPanel />} />
                </Routes>
                
                {/* Global components */}
                <DebugPanel />
                <GlobalFeedbackButton />
                <Toaster />
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
