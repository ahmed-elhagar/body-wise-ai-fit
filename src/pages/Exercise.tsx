
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { ExerciseContainer } from "@/features/exercise";
import { ExerciseErrorBoundary } from "@/components/exercise/ExerciseErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <ExerciseContainer />
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
