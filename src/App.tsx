
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import MealPlan from "@/pages/MealPlan";
import Exercise from "@/pages/Exercise";
import Progress from "@/pages/Progress";
import WeightTracking from "@/pages/WeightTracking";
import CalorieChecker from "@/pages/CalorieChecker";
import AIChatPage from "@/pages/AIChatPage";
import NotFound from "@/pages/NotFound";
import Pro from "@/pages/Pro";
import Coach from "@/pages/Coach";
import Admin from "@/pages/Admin";

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <Layout>
                      <Profile />
                    </Layout>
                  } 
                />
                <Route 
                  path="/meal-plan" 
                  element={
                    <Layout>
                      <MealPlan />
                    </Layout>
                  } 
                />
                <Route 
                  path="/exercise" 
                  element={
                    <Layout>
                      <Exercise />
                    </Layout>
                  } 
                />
                <Route 
                  path="/progress" 
                  element={
                    <Layout>
                      <Progress />
                    </Layout>
                  } 
                />
                <Route 
                  path="/weight-tracking" 
                  element={
                    <Layout>
                      <WeightTracking />
                    </Layout>
                  } 
                />
                <Route 
                  path="/calorie-checker" 
                  element={
                    <Layout>
                      <CalorieChecker />
                    </Layout>
                  } 
                />
                <Route 
                  path="/ai-chat" 
                  element={
                    <Layout>
                      <AIChatPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/pro" 
                  element={
                    <Layout>
                      <Pro />
                    </Layout>
                  } 
                />
                <Route 
                  path="/coach" 
                  element={
                    <Layout>
                      <Coach />
                    </Layout>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <Layout>
                      <Admin />
                    </Layout>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
