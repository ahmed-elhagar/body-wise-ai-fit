
import { User } from "lucide-react";

interface AuthHeaderProps {
  isSignUp: boolean;
}

export const AuthHeader = ({ isSignUp }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
        FitGenius AI
      </h1>
      <p className="text-gray-600 mt-2">
        {isSignUp ? 'Create your account' : 'Welcome back!'}
      </p>
    </div>
  );
};
