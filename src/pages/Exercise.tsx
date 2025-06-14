
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { ExercisePageContainer } from "@/features/exercise";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExercisePageContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
