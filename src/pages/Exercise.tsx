
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import EnhancedExercisePage from "@/components/exercise/EnhancedExercisePage";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ErrorBoundary>
          <EnhancedExercisePage />
        </ErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
