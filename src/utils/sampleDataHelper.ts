
import { supabase } from "@/integrations/supabase/client";

// Helper to create sample data with valid constraint values
export const createSampleProfiles = async () => {
  console.log('🎯 Creating sample coach-trainee data...');
  
  try {
    // Call the edge function to create sample data
    const { data, error } = await supabase.functions.invoke('create-sample-data', {
      method: 'POST'
    });

    if (error) {
      console.error('❌ Error creating sample data:', error);
      throw error;
    }

    console.log('✅ Sample data created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to create sample data:', error);
    throw error;
  }
};

// Valid fitness goal values based on common constraint patterns
export const validFitnessGoals = [
  'lose_weight',
  'build_muscle', 
  'improve_endurance',
  'general_fitness'
];

export const sampleCoaches = [
  {
    email: 'coach1@fitgenius.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    fitness_goal: 'improve_endurance'
  },
  {
    email: 'coach2@fitgenius.com', 
    first_name: 'Mike',
    last_name: 'Rodriguez',
    fitness_goal: 'build_muscle'
  }
];

export const sampleTrainees = [
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
    fitness_goal: 'improve_endurance'
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
