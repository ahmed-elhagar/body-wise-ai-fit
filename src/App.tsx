
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import { memo } from "react";
import { 
  LazyMealPlan, 
  LazyExercise, 
  LazyAdmin, 
  LazyProgress, 
  LazyProfile, 
  LazyCalorieChecker,
  LazyAIChatPage,
  withSuspense 
} from "@/components/LazyPages";

// Optimize QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
      networkMode: 'offlineFirst'
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst'
    },
  },
});

// Memoize layout wrapper to prevent unnecessary re-renders
const LayoutWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
));

LayoutWrapper.displayName = 'LayoutWrapper';

// Wrap lazy components with suspense
const MealPlan = withSuspense(LazyMealPlan);
const Exercise = withSuspense(LazyExercise);
const Admin = withSuspense(LazyAdmin);
const Progress = withSuspense(LazyProgress);
const Profile = withSuspense(LazyProfile);
const CalorieChecker = withSuspense(LazyCalorieChecker);
const AIChatPage = withSuspense(LazyAIChatPage);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <LanguageProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
                  <Route path="/meal-plan" element={<LayoutWrapper><MealPlan /></LayoutWrapper>} />
                  <Route path="/exercise" element={<LayoutWrapper><Exercise /></LayoutWrapper>} />
                  <Route path="/progress" element={<LayoutWrapper><Progress /></LayoutWrapper>} />
                  <Route path="/profile" element={<LayoutWrapper><Profile /></LayoutWrapper>} />
                  <Route path="/admin" element={<LayoutWrapper><Admin /></LayoutWrapper>} />
                  <Route path="/calorie-checker" element={<LayoutWrapper><CalorieChecker /></LayoutWrapper>} />
                  <Route path="/ai-chat" element={<LayoutWrapper><AIChatPage /></LayoutWrapper>} />
                </Routes>
              </BrowserRouter>
            </LanguageProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
