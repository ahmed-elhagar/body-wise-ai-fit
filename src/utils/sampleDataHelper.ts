
import { supabase } from "@/integrations/supabase/client";

// Helper to create sample data using existing users
export const createSampleProfiles = async () => {
  console.log('🎯 Creating sample coach-trainee data using existing users...');
  
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

// Note: This approach now uses existing authenticated users instead of creating new ones
// Make sure you have at least 3 user accounts created through the authentication system
// before using this function
