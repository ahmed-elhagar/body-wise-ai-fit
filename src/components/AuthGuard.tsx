
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoadingState } from "@/components/ui/enhanced-loading-states";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCoach?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false, requireCoach = false }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoadingState variant="branded" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check coach requirement
  if (requireCoach && !['admin', 'coach'].includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
