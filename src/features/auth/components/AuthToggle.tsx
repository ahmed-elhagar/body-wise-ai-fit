
import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: () => void;
  loading: boolean;
}

export const AuthToggle = ({ isSignUp, onToggle, loading }: AuthToggleProps) => {
  return (
    <div className="text-center mt-6">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="text-sm hover:bg-gray-100"
        disabled={loading}
      >
        {isSignUp 
          ? "Already have an account? Sign in" 
          : "Don't have an account? Sign up"
        }
      </Button>
    </div>
  );
};

// Default export for compatibility
export default AuthToggle;
