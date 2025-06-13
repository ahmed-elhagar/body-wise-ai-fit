
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoadingState } from "@/components/ui/enhanced-loading-states";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCoach?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false, requireCoach = false }: AuthGuardProps) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return <PageLoadingState variant="branded" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin requirement
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check coach requirement
  if (requireCoach && !['admin', 'coach'].includes(profile?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
