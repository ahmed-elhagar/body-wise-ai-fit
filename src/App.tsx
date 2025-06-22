
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ErrorBoundary } from 'react-error-boundary';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import OnboardingContainer from '@/features/auth/components/onboarding/OnboardingContainer';
import { useAuth } from '@/features/auth/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import MealPlanPage from '@/features/meal-plan/components/MealPlanPage';
import ExercisePage from '@/features/exercise/components/ExercisePage';
import ChatPage from '@/features/chat/components/ChatPage';
import CoachPage from '@/features/coach/components/CoachPage';
import ProfilePage from '@/features/profile/components/ProfilePage';
import AdminPage from '@/features/admin/components/AdminPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <OnboardingContainer 
              onComplete={() => window.location.href = '/'} 
              isCompleting={false} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meal-plan" 
        element={
          <ProtectedRoute>
            <MealPlanPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exercise" 
        element={
          <ProtectedRoute>
            <ExercisePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/coach" 
        element={
          <ProtectedRoute>
            <CoachPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <AppContent />
              <Toaster position="top-right" />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
