import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: AppRole;
  fallbackPath?: string;
}

export default function ProtectedRoute({ children, requiredRole, fallbackPath = "/" }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/?auth=login&redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  if (!hasRole(requiredRole)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You don't have the required permissions to access this area. 
            Contact an administrator if you believe this is an error.
          </p>
          <a href={fallbackPath} className="inline-block mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Go Back
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
