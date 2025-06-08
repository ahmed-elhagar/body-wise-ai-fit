
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import ExerciseProgramPage from "@/components/exercise/ExerciseProgramPage";
import { ExerciseErrorBoundary } from "@/components/exercise/ExerciseErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <ExerciseProgramPage />
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
