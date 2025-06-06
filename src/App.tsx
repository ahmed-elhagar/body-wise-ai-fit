
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import UnifiedSignup from '@/pages/UnifiedSignup';
import Dashboard from '@/pages/Dashboard';
import OnboardingSuccess from '@/pages/OnboardingSuccess';

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
                element={<UnifiedSignup />}
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
