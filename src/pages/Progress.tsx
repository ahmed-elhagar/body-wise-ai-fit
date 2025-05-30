
import ProtectedRoute from "@/components/ProtectedRoute";

const Progress = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="ml-16 lg:ml-64 min-h-screen">
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Progress Tracking</h1>
            <p className="text-gray-600">Track your fitness progress here.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Progress;
