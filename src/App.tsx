
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import GlobalFeedbackButton from '@/components/GlobalFeedbackButton';

// Page imports
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import EnhancedProfile from '@/pages/EnhancedProfile';
import Onboarding from '@/pages/Onboarding';
import MealPlan from '@/pages/MealPlan';
import Exercise from '@/pages/Exercise';
import WeightTracking from '@/pages/WeightTracking';
import CalorieChecker from '@/pages/CalorieChecker';
import AIChatPage from '@/pages/AIChatPage';
import AdminPanel from '@/pages/AdminPanel';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/enhanced-profile" element={<EnhancedProfile />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/meal-plan" element={<MealPlan />} />
                <Route path="/exercise" element={<Exercise />} />
                <Route path="/weight-tracking" element={<WeightTracking />} />
                <Route path="/calorie-checker" element={<CalorieChecker />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <GlobalFeedbackButton />
              <Toaster position="top-right" />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
