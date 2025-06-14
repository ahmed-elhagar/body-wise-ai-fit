
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
  requireAuth?: boolean;
  preventAuthenticatedAccess?: boolean;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireRole,
  requireAuth = true,
  preventAuthenticatedAccess = false,
  requireProfile = false
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Handle preventAuthenticatedAccess (for login/signup pages)
  if (preventAuthenticatedAccess && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle requireAuth
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Handle requireAuth = false (public routes)
  if (requireAuth === false) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
