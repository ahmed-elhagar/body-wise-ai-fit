
export { default as ProgressDashboard } from './ProgressDashboard';
export { default as WeightProgressSection } from './WeightProgressSection';
export { default as FitnessProgressSection } from './FitnessProgressSection';
export { default as GoalsProgressSection } from './GoalsProgressSection';
export { default as NutritionProgressSection } from './NutritionProgressSection';
export { default as AchievementsSection } from './AchievementsSection';
export { default as ModernProgressTracker } from './ModernProgressTracker';
export { default as WeightTracking } from './WeightTracking';
export { default as ProgressPage } from './ProgressPage';

// Create missing components as placeholders
export const ProgressOverview = () => {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Progress Overview</h3>
      <p className="text-blue-600">Your fitness journey overview will appear here.</p>
    </div>
  );
};
