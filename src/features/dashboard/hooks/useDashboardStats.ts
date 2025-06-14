import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";

export const useDashboardStats = () => {
  const { profile } = useProfile();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();

  console.log('Dashboard - Profile data:', profile);
  console.log('Dashboard - Weight entries:', weightEntries);

  // Use profile weight as primary source, fallback to weight tracking if profile weight doesn't exist
  const profileWeight = profile?.weight;
  const latestTrackedWeight = weightEntries && weightEntries.length > 0 ? weightEntries[0]?.weight : null;
  const previousTrackedWeight = weightEntries && weightEntries.length > 1 ? weightEntries[1]?.weight : null;
  
  // Primary weight source is profile, secondary is tracking data
  const displayWeight = profileWeight || latestTrackedWeight;
  const weightSource = profileWeight ? 'profile' : 'tracking';
  
  // Calculate weight change only if we have tracking data
  const weightChange = latestTrackedWeight && previousTrackedWeight ? latestTrackedWeight - previousTrackedWeight : null;
  
  const heightInMeters = profile?.height ? profile.height / 100 : null;

  const calculateBMI = () => {
    if (!heightInMeters || !displayWeight) return null;
    return (displayWeight / Math.pow(heightInMeters, 2)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : 'Complete profile';

  return {
    profile,
    displayWeight,
    weightLoading,
    weightChange,
    weightSource,
    bmi,
    bmiCategory
  };
};
