import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSessionManager } from '@/hooks/useSessionManager';

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import MealPlan from "./pages/MealPlan";
import Exercise from "./pages/Exercise";
import WeightTracking from "./pages/WeightTracking";
import CalorieChecker from "./pages/CalorieChecker";
import AIChatPage from "./pages/AIChatPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Initialize session manager
  useSessionManager();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Onboarding Route - Requires auth but not complete profile */}
              <Route path="/onboarding" element={
                <ProtectedRoute requireProfile={false}>
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes - Require auth and basic profile */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireProfile={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute requireProfile={true}>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/meal-plan" element={
                <ProtectedRoute requireProfile={true}>
                  <MealPlan />
                </ProtectedRoute>
              } />
              
              <Route path="/exercise" element={
                <ProtectedRoute requireProfile={true}>
                  <Exercise />
                </ProtectedRoute>
              } />
              
              <Route path="/weight-tracking" element={
                <ProtectedRoute requireProfile={true}>
                  <WeightTracking />
                </ProtectedRoute>
              } />
              
              <Route path="/calorie-checker" element={
                <ProtectedRoute requireProfile={true}>
                  <CalorieChecker />
                </ProtectedRoute>
              } />
              
              <Route path="/ai-chat" element={
                <ProtectedRoute requireProfile={true}>
                  <AIChatPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Route */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              {/* 404 and Catch-all */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
