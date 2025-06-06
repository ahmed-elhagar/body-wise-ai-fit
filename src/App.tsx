
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  Exercise,
  FoodTracker,
  Chat,
  Admin,
  Coach
} = LazyPages;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireAuth={true}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requireAuth={true}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/exercise" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <Exercise />
              </ProtectedRoute>
            } />
            <Route path="/food-tracker" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <FoodTracker />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAuth={true} requireRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/coach" element={
              <ProtectedRoute requireAuth={true} requireRole={["coach", "admin"]}>
                <Coach />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
