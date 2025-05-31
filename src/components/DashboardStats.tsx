
import { WeightCard, BMICard, FitnessGoalCard, ActivityLevelCard, useDashboardStats } from "./dashboard-stats";

const DashboardStats = () => {
  const { profile, displayWeight, weightLoading, weightChange, weightSource, bmi, bmiCategory } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <WeightCard
        displayWeight={displayWeight}
        weightLoading={weightLoading}
        weightChange={weightChange}
        weightSource={weightSource}
      />
      
      <BMICard
        bmi={bmi}
        bmiCategory={bmiCategory}
      />
      
      <FitnessGoalCard
        fitnessGoal={profile?.fitness_goal}
      />
      
      <ActivityLevelCard
        activityLevel={profile?.activity_level}
      />
    </div>
  );
};

export default DashboardStats;
