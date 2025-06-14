
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { ExercisePageContainer } from "@/features/exercise";
import { ExerciseErrorBoundary } from "@/components/exercise/ExerciseErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <ExercisePageContainer />
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
