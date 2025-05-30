
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import MealPlan from "@/pages/MealPlan";
import Exercise from "@/pages/Exercise";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Landing from "@/pages/Landing";
import { memo } from "react";

// Optimize QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Memoize layout wrapper to prevent unnecessary re-renders
const LayoutWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
));

LayoutWrapper.displayName = 'LayoutWrapper';

function App() {
  return (
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
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
