
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { EnhancedExercisePage } from "@/features/exercise";
import { ExerciseErrorBoundary } from "@/components/exercise/ExerciseErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <EnhancedExercisePage />
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
