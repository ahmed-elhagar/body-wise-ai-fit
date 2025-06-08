
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { EnhancedExercisePage } from "@/components/exercise/EnhancedExercisePage";
import ExerciseErrorBoundary from "@/components/exercise/ExerciseErrorBoundary";

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExerciseErrorBoundary>
          <EnhancedExercisePage 
            exercises={[]}
            currentDay={1}
            onDayChange={() => {}}
            workoutType="home"
          />
        </ExerciseErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
