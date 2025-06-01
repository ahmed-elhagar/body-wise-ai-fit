
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
          <p className="text-gray-600 mb-8">Your AI-powered fitness companion</p>
          <div className="space-y-4">
            <a
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
