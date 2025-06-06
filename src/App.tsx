
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import SignupFlow from '@/pages/SignupFlow';
import Dashboard from '@/pages/Dashboard';
import OnboardingSuccess from '@/pages/OnboardingSuccess';
import MealPlan from '@/pages/MealPlan';
import Exercise from '@/pages/Exercise';
import FoodTracker from '@/pages/FoodTracker';
import CalorieChecker from '@/pages/CalorieChecker';
import Goals from '@/pages/Goals';
import Progress from '@/pages/Progress';
import WeightTracking from '@/pages/WeightTracking';
import Profile from '@/pages/Profile';
import OptimizedProfile from '@/pages/OptimizedProfile';
import Settings from '@/pages/Settings';
import Chat from '@/pages/Chat';
import Notifications from '@/pages/Notifications';
import Admin from '@/pages/Admin';
import Coach from '@/pages/Coach';
import Analytics from '@/pages/Analytics';
import Pro from '@/pages/Pro';
import NotFound from '@/pages/NotFound';

// Create a client
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
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              
              {/* Auth route for login only */}
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } 
              />
              
              {/* Unified signup flow */}
              <Route 
                path="/signup" 
                element={<SignupFlow />}
              />
              
              {/* Redirect old onboarding route to signup */}
              <Route path="/onboarding" element={<Navigate to="/signup" replace />} />
              
              {/* Success page */}
              <Route 
                path="/onboarding-success" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <OnboardingSuccess />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/coach" 
                element={
                  <ProtectedRoute requireRole="coach">
                    <Coach />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/pro" 
                element={
                  <ProtectedRoute>
                    <Pro />
                  </ProtectedRoute>
                } 
              />
              
              {/* Meal Plan */}
              <Route 
                path="/meal-plan" 
                element={
                  <ProtectedRoute>
                    <MealPlan />
                  </ProtectedRoute>
                } 
              />
              
              {/* Exercise */}
              <Route 
                path="/exercise" 
                element={
                  <ProtectedRoute>
                    <Exercise />
                  </ProtectedRoute>
                } 
              />
              
              {/* Food Tracker */}
              <Route 
                path="/food-tracker" 
                element={
                  <ProtectedRoute>
                    <FoodTracker />
                  </ProtectedRoute>
                } 
              />
              
              {/* Calorie Checker */}
              <Route 
                path="/calorie-checker" 
                element={
                  <ProtectedRoute>
                    <CalorieChecker />
                  </ProtectedRoute>
                } 
              />
              
              {/* Goals */}
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } 
              />
              
              {/* Progress */}
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } 
              />
              
              {/* Weight Tracking */}
              <Route 
                path="/weight-tracking" 
                element={
                  <ProtectedRoute>
                    <WeightTracking />
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Optimized Profile */}
              <Route 
                path="/optimized-profile" 
                element={
                  <ProtectedRoute>
                    <OptimizedProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Settings */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Chat */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              
              {/* Notifications */}
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster richColors position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
