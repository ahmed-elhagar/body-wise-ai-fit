
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import { LazyPages } from "./components/LazyPages";

const queryClient = new QueryClient();

const {
  Landing,
  Auth,
  RegisterOnboarding,
  Onboarding,
  OnboardingSuccess,
  Dashboard,
  Settings,
  Profile,
  Meal,
  Exercise,
  ExerciseProgram,
  FoodTracker,
  Chat,
  Admin,
  Coach
} = LazyPages;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<RegisterOnboarding />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding-success" element={<OnboardingSuccess />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/meal" element={
                <ProtectedRoute>
                  <Meal />
                </ProtectedRoute>
              } />
              <Route path="/exercise" element={
                <ProtectedRoute>
                  <Exercise />
                </ProtectedRoute>
              } />
              <Route path="/exercise-program" element={
                <ProtectedRoute>
                  <ExerciseProgram />
                </ProtectedRoute>
              } />
              <Route path="/food-tracker" element={
                <ProtectedRoute>
                  <FoodTracker />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/coach" element={
                <ProtectedRoute>
                  <Coach />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nextProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
