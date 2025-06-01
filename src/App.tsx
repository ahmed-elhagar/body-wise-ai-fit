
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MealPlan from "./pages/MealPlan";
import Exercise from "./pages/Exercise";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Coach from "./pages/Coach";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Landing from "./pages/Landing";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import "./App.css";
import "./i18n/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <SidebarProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes - redirect to dashboard if authenticated */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Index />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/landing" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Landing />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/auth" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Auth />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected routes - require authentication */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/meal-plan" 
                      element={
                        <ProtectedRoute>
                          <MealPlan />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/exercise" 
                      element={
                        <ProtectedRoute>
                          <Exercise />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/progress/:tab?" 
                      element={
                        <ProtectedRoute>
                          <Progress />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/coach" 
                      element={
                        <ProtectedRoute>
                          <Coach />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/chat" 
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
