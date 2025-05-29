
import { supabase } from "@/integrations/supabase/client";

interface BasicFoodItem {
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_description?: string;
  cuisine_type?: string;
}

const basicFoods: BasicFoodItem[] = [
  {
    name: "chicken breast",
    category: "protein",
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    serving_description: "100g serving",
    cuisine_type: "general"
  },
  {
    name: "white rice",
    category: "grains",
    calories_per_100g: 130,
    protein_per_100g: 2.7,
    carbs_per_100g: 28,
    fat_per_100g: 0.3,
    serving_description: "100g cooked",
    cuisine_type: "general"
  },
  {
    name: "banana",
    category: "fruits",
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 23,
    fat_per_100g: 0.3,
    serving_description: "1 medium banana (100g)",
    cuisine_type: "general"
  },
  {
    name: "broccoli",
    category: "vegetables",
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    serving_description: "100g serving",
    cuisine_type: "general"
  },
  {
    name: "salmon",
    category: "protein",
    calories_per_100g: 208,
    protein_per_100g: 22,
    carbs_per_100g: 0,
    fat_per_100g: 13,
    serving_description: "100g fillet",
    cuisine_type: "general"
  },
  {
    name: "apple",
    category: "fruits",
    calories_per_100g: 52,
    protein_per_100g: 0.3,
    carbs_per_100g: 14,
    fat_per_100g: 0.2,
    serving_description: "1 medium apple (100g)",
    cuisine_type: "general"
  },
  {
    name: "brown rice",
    category: "grains",
    calories_per_100g: 112,
    protein_per_100g: 2.6,
    carbs_per_100g: 23,
    fat_per_100g: 0.9,
    serving_description: "100g cooked",
    cuisine_type: "general"
  },
  {
    name: "eggs",
    category: "protein",
    calories_per_100g: 155,
    protein_per_100g: 13,
    carbs_per_100g: 1.1,
    fat_per_100g: 11,
    serving_description: "2 large eggs (100g)",
    cuisine_type: "general"
  }
];

export const seedBasicFoods = async () => {
  try {
    console.log('Seeding basic foods to database...');
    
    const { data, error } = await supabase
      .from('food_items')
      .upsert(
        basicFoods.map(food => ({
          ...food,
          serving_size_g: 100,
          confidence_score: 0.95,
          verified: true,
          source: 'seed_data'
        })),
        { 
          onConflict: 'name',
          ignoreDuplicates: false 
        }
      )
      .select();

    if (error) {
      console.error('Error seeding foods:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} foods`);
    return data;
  } catch (error) {
    console.error('Failed to seed basic foods:', error);
    throw error;
  }
};
