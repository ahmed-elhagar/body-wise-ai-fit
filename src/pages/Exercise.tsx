
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import ExercisePageRefactored from "@/components/exercise/ExercisePageRefactored";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ErrorBoundary>
          <ExercisePageRefactored />
        </ErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
