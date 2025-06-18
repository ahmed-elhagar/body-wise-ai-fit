
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import PageLoading from "./ui/PageLoading";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
  requireAuth?: boolean;
  preventAuthenticatedAccess?: boolean;
  requireRole?: string;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ 
  redirectPath = "/login", 
  children, 
  requireAuth = true,
  preventAuthenticatedAccess = false,
  requireRole,
  requireProfile = false
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  if (isLoading || (requireProfile && profileLoading)) {
    return <PageLoading />;
  }

  // If we want to prevent authenticated users from accessing (like login/signup pages)
  if (preventAuthenticatedAccess && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If we don't require auth, render children
  if (!requireAuth) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if profile is required
  if (requireProfile && !profile) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check role requirement (simplified - in real app you'd check user_roles table)
  if (requireRole) {
    // For now, just check if user exists - you'd implement proper role checking here
    if (!user) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
