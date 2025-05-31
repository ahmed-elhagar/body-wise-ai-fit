
// Helper to create sample data with valid constraint values
export const createSampleProfiles = async () => {
  // We'll use valid fitness_goal values that should pass the constraint
  // Common valid values are usually: 'lose_weight', 'build_muscle', 'maintain_weight', 'improve_endurance'
  
  const validFitnessGoals = [
    'lose_weight',
    'build_muscle', 
    'maintain_weight',
    'improve_endurance'
  ];

  const sampleCoaches = [
    {
      email: 'coach1@fitgenius.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      fitness_goal: 'maintain_weight'
    },
    {
      email: 'coach2@fitgenius.com', 
      first_name: 'Mike',
      last_name: 'Rodriguez',
      fitness_goal: 'build_muscle'
    }
  ];

  const sampleTrainees = [
    {
      email: 'trainee1@fitgenius.com',
      first_name: 'Emma', 
      last_name: 'Davis',
      fitness_goal: 'lose_weight'
    },
    {
      email: 'trainee2@fitgenius.com',
      first_name: 'James',
      last_name: 'Wilson', 
      fitness_goal: 'build_muscle'
    },
    {
      email: 'trainee3@fitgenius.com',
      first_name: 'Lisa',
      last_name: 'Brown',
      fitness_goal: 'maintain_weight'
    },
    {
      email: 'trainee4@fitgenius.com',
      first_name: 'David',
      last_name: 'Taylor',
      fitness_goal: 'lose_weight'
    },
    {
      email: 'trainee5@fitgenius.com',
      first_name: 'Anna',
      last_name: 'Martinez',
      fitness_goal: 'build_muscle'
    }
  ];

  return { sampleCoaches, sampleTrainees, validFitnessGoals };
};
