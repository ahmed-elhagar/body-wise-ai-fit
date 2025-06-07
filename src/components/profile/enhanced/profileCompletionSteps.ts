
interface ProfileCompletionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route?: string;
}

export const getProfileCompletionSteps = (profile: any, assessment: any): ProfileCompletionStep[] => {
  return [
    {
      id: 'basic_info',
      title: 'Basic Information',
      description: 'Complete your personal details',
      completed: !!(profile?.first_name && profile?.last_name && profile?.age && profile?.gender),
      route: '/profile'
    },
    {
      id: 'physical_info',
      title: 'Physical Information',
      description: 'Add your height, weight, and body metrics',
      completed: !!(profile?.height && profile?.weight && profile?.body_shape),
      route: '/profile'
    },
    {
      id: 'goals',
      title: 'Fitness Goals',
      description: 'Set your fitness goals and activity level',
      completed: !!(profile?.fitness_goal && profile?.activity_level),
      route: '/profile'
    },
    {
      id: 'health_assessment',
      title: 'Health Assessment',
      description: 'Complete your health and wellness assessment',
      completed: !!(assessment?.stress_level && assessment?.sleep_quality && assessment?.energy_level),
      route: '/profile'
    }
  ];
};

export const calculateCompletionPercentage = (steps: ProfileCompletionStep[]): number => {
  const completedSteps = steps.filter(step => step.completed).length;
  return Math.round((completedSteps / steps.length) * 100);
};
