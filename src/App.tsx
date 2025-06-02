
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DebugPanel from "@/components/DebugPanel";
import AuthDebugPanel from "@/components/auth/AuthDebugPanel";
import { LazyPages } from "@/components/LazyPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LazyPages.Index />} />
              
              {/* Public routes */}
              <Route 
                path="/landing" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                    <LazyPages.Landing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                    <LazyPages.Auth />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LazyPages.Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LazyPages.Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meal-plan" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.MealPlan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exercise" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.Exercise />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/food-tracker" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.FoodTracker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calorie-checker" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.CalorieChecker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/weight-tracking" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.WeightTracking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.Goals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.Progress />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LazyPages.Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LazyPages.Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute requireAuth={true} requireProfile={true}>
                    <LazyPages.Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pro" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LazyPages.Pro />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true} requireRole="admin">
                    <LazyPages.Admin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Coach routes */}
              <Route 
                path="/coach" 
                element={
                  <ProtectedRoute requireAuth={true} requireRole={["coach", "admin"]}>
                    <LazyPages.Coach />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<LazyPages.NotFound />} />
            </Routes>
            
            {/* Debug panels */}
            <DebugPanel />
            <AuthDebugPanel />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
