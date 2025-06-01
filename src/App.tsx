import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/i18n/config";

const LoginPage = lazy(() => import("@/pages/auth/Login"));
const RegisterPage = lazy(() => import("@/pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPassword"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const MealPlanPage = lazy(() => import("@/pages/MealPlan"));
const ExercisePage = lazy(() => import("@/pages/Exercise"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const FoodTrackerPage = lazy(() => import("@/pages/FoodTracker"));
const GoalsPage = lazy(() => import("@/pages/Goals"));
const ProgressPage = lazy(() => import("@/pages/Progress"));
const WeightTrackingPage = lazy(() => import("@/pages/WeightTracking"));
const CoachPanelPage = lazy(() => import("@/pages/coach/CoachPanel"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboard"));
const TraineeChatPage = lazy(() => import("@/pages/coach/TraineeChat"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Toaster />
              <BrowserRouter>
                <Suspense fallback={<LoadingIndicator />}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
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
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/food-tracker"
                      element={
                        <ProtectedRoute>
                          <FoodTrackerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/goals"
                      element={
                        <ProtectedRoute>
                          <GoalsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/progress"
                      element={
                        <ProtectedRoute>
                          <ProgressPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/weight-tracking"
                      element={
                        <ProtectedRoute>
                          <WeightTrackingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/coach-panel"
                      element={
                        <ProtectedRoute requiredRole="coach">
                          <CoachPanelPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trainee-chat/:traineeId"
                      element={
                        <ProtectedRoute requiredRole="coach">
                          <TraineeChatPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
