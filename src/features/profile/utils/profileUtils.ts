
export const calculateProfileCompletion = (profile: any) => {
  let score = 0;
  
  // Basic info (50 points total)
  if (profile?.first_name) score += 10;
  if (profile?.last_name) score += 10;
  if (profile?.age) score += 10;
  if (profile?.gender) score += 10;
  if (profile?.height && profile?.weight) score += 10;
  
  // Health assessment (30 points total)
  if (profile?.activity_level) score += 15;
  if (profile?.fitness_goal) score += 15;
  
  // Preferences (20 points total)
  if (profile?.dietary_restrictions !== null) score += 10;
  if (profile?.allergies !== null) score += 10;
  
  return Math.min(score, 100);
};

export const getProfileCompletionStatus = (percentage: number) => {
  if (percentage >= 80) return { label: "Complete", color: "bg-green-100 text-green-800 border-green-200" };
  if (percentage >= 50) return { label: "In Progress", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  return { label: "Incomplete", color: "bg-red-100 text-red-800 border-red-200" };
};
