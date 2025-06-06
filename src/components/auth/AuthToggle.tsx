
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: () => void;
  loading: boolean;
}

export const AuthToggle = ({ isSignUp, onToggle, loading }: AuthToggleProps) => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    // Redirect to the new signup flow instead of toggling
    navigate('/signup');
  };

  return (
    <div className="text-center mt-6">
      <Button
        variant="ghost"
        onClick={isSignUp ? onToggle : handleSignUpClick}
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
