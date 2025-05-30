
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

const queryClient = new QueryClient();

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
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/meal-plan" element={<Layout><MealPlan /></Layout>} />
                <Route path="/exercise" element={<Layout><Exercise /></Layout>} />
                <Route path="/progress" element={<Layout><Progress /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/admin" element={<Layout><Admin /></Layout>} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
