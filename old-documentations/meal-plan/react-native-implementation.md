
# React Native Implementation Guide for Meal Plans

Complete implementation guide for building meal plan features in React Native/Expo with the FitFatta backend.

## 📱 App Architecture Overview

### 1. Feature-Based Folder Structure
```
src/
├── features/
│   └── meal-plan/
│       ├── components/
│       │   ├── MealPlanHeader.tsx
│       │   ├── WeekSelector.tsx
│       │   ├── DailyMealsView.tsx
│       │   ├── MealCard.tsx
│       │   ├── NutritionSummary.tsx
│       │   ├── GeneratePlanModal.tsx
│       │   └── index.ts
│       ├── screens/
│       │   ├── MealPlanScreen.tsx
│       │   ├── MealDetailScreen.tsx
│       │   ├── RecipeScreen.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useMealPlanData.ts
│       │   ├── useMealGeneration.ts
│       │   ├── useMealPlanOffline.ts
│       │   └── index.ts
│       ├── services/
│       │   ├── MealPlanAPI.ts
│       │   ├── MealPlanCache.ts
│       │   ├── NutritionCalculator.ts
│       │   └── index.ts
│       ├── types/
│       │   ├── MealPlan.ts
│       │   ├── Nutrition.ts
│       │   └── index.ts
│       └── utils/
│           ├── dateHelpers.ts
│           ├── nutritionHelpers.ts
│           └── index.ts
```

## 🏗️ Core Components Implementation

### 1. Main Meal Plan Screen
```typescript
// src/features/meal-plan/screens/MealPlanScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealPlanData } from '../hooks/useMealPlanData';
import { useAuth } from '@/hooks/useAuth';
import { MealPlanHeader } from '../components/MealPlanHeader';
import { WeekSelector } from '../components/WeekSelector';
import { DailyMealsView } from '../components/DailyMealsView';
import { NutritionSummary } from '../components/NutritionSummary';
import { GeneratePlanModal } from '../components/GeneratePlanModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export const MealPlanScreen: React.FC = () => {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const {
    mealPlan,
    isLoading,
    error,
    refetch,
    generateMealPlan,
    isGenerating
  } = useMealPlanData(user?.id, weekOffset);

  const handleGeneratePlan = async (preferences: MealPlanPreferences) => {
    try {
      await generateMealPlan(preferences);
      setShowGenerateModal(false);
      Alert.alert('Success', 'Your meal plan has been generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && !mealPlan) {
    return <LoadingSpinner message="Loading your meal plan..." />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
        >
          <MealPlanHeader
            user={user}
            onGeneratePress={() => setShowGenerateModal(true)}
            isGenerating={isGenerating}
          />

          <WeekSelector
            weekOffset={weekOffset}
            onWeekChange={setWeekOffset}
          />

          {mealPlan ? (
            <>
              <NutritionSummary
                totalCalories={mealPlan.totalCalories}
                totalProtein={mealPlan.totalProtein}
                totalCarbs={mealPlan.totalCarbs}
                totalFat={mealPlan.totalFat}
                dailyTarget={calculateDailyTarget(user)}
              />

              <DailyMealsView
                dailyMeals={mealPlan.dailyMeals}
                selectedDay={selectedDay}
                onDayChange={setSelectedDay}
                weekStartDate={mealPlan.weekStartDate}
              />
            </>
          ) : (
            <EmptyMealPlanView
              onGeneratePress={() => setShowGenerateModal(true)}
            />
          )}
        </ScrollView>

        <GeneratePlanModal
          visible={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGeneratePlan}
          userProfile={user}
          isGenerating={isGenerating}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
```

### 2. Daily Meals View Component
```typescript
// src/features/meal-plan/components/DailyMealsView.tsx
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { MealCard } from './MealCard';
import { DailyMeal } from '../types/MealPlan';
import { getDayName, formatDate } from '../utils/dateHelpers';

interface DailyMealsViewProps {
  dailyMeals: DailyMeal[];
  selectedDay: number;
  onDayChange: (day: number) => void;
  weekStartDate: string;
}

export const DailyMealsView: React.FC<DailyMealsViewProps> = ({
  dailyMeals,
  selectedDay,
  onDayChange,
  weekStartDate
}) => {
  const screenWidth = Dimensions.get('window').width;
  const dayMeals = dailyMeals.filter(meal => meal.dayNumber === selectedDay);
  const selectedDate = calculateDateForDay(weekStartDate, selectedDay);

  return (
    <View style={styles.container}>
      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      >
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton
            ]}
            onPress={() => onDayChange(day)}
          >
            <Text style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText
            ]}>
              {getDayName(day, 'short')}
            </Text>
            <Text style={[
              styles.dateText,
              selectedDay === day && styles.selectedDateText
            ]}>
              {formatDate(calculateDateForDay(weekStartDate, day), 'DD')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Day Header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>
          {getDayName(selectedDay)} - {formatDate(selectedDate, 'MMM DD')}
        </Text>
        <Text style={styles.daySubtitle}>
          {dayMeals.length} meals planned
        </Text>
      </View>

      {/* Meals List */}
      <View style={styles.mealsContainer}>
        {dayMeals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() => navigateToMealDetail(meal)}
            onMarkComplete={() => handleMealComplete(meal.id)}
            style={styles.mealCard}
          />
        ))}

        {dayMeals.length === 0 && (
          <EmptyDayView onAddMeal={() => handleAddMeal(selectedDay)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  daySelector: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    minWidth: 60,
  },
  selectedDayButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginTop: 2,
  },
  selectedDateText: {
    color: '#ffffff',
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  daySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    marginBottom: 8,
  },
});
```

### 3. Meal Card Component
```typescript
// src/features/meal-plan/components/MealCard.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { DailyMeal } from '../types/MealPlan';
import { getMealTypeIcon, getMealTypeColor } from '../utils/mealHelpers';

interface MealCardProps {
  meal: DailyMeal;
  onPress: () => void;
  onMarkComplete?: () => void;
  style?: any;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onPress,
  onMarkComplete,
  style
}) => {
  const mealTypeColor = getMealTypeColor(meal.mealType);
  const totalTime = meal.prepTime + meal.cookTime;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Meal Image */}
      <View style={styles.imageContainer}>
        {meal.imageUrl ? (
          <Image
            source={{ uri: meal.imageUrl }}
            style={styles.mealImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: mealTypeColor }]}>
            <Icon
              name={getMealTypeIcon(meal.mealType)}
              size={32}
              color="#ffffff"
            />
          </View>
        )}

        {/* Meal Type Badge */}
        <View style={[styles.mealTypeBadge, { backgroundColor: mealTypeColor }]}>
          <Text style={styles.mealTypeText}>
            {meal.mealType.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Meal Info */}
      <View style={styles.contentContainer}>
        <View style={styles.mainInfo}>
          <Text style={styles.mealName} numberOfLines={2}>
            {meal.name}
          </Text>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{meal.calories}</Text>
              <Text style={styles.nutritionLabel}>cal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(meal.protein)}g</Text>
              <Text style={styles.nutritionLabel}>protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(meal.carbs)}g</Text>
              <Text style={styles.nutritionLabel}>carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(meal.fat)}g</Text>
              <Text style={styles.nutritionLabel}>fat</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock" size={14} color="#6c757d" />
              <Text style={styles.metaText}>{totalTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="users" size={14} color="#6c757d" />
              <Text style={styles.metaText}>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {onMarkComplete && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={onMarkComplete}
            >
              <Icon name="check" size={16} color="#28a745" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View Recipe</Text>
            <Icon name="arrow-right" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mealTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  contentContainer: {
    padding: 16,
  },
  mainInfo: {
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
```

## 🔄 State Management with React Query

### 1. Meal Plan Data Hook
```typescript
// src/features/meal-plan/hooks/useMealPlanData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MealPlanAPI } from '../services/MealPlanAPI';
import { MealPlanCache } from '../services/MealPlanCache';
import { WeeklyMealPlan, MealPlanPreferences } from '../types/MealPlan';
import { calculateWeekStartDate } from '../utils/dateHelpers';

export const useMealPlanData = (userId: string, weekOffset: number = 0) => {
  const queryClient = useQueryClient();
  const weekStartDate = calculateWeekStartDate(weekOffset);

  // Query for meal plan data
  const {
    data: mealPlan,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mealPlan', userId, weekStartDate],
    queryFn: async () => {
      if (!userId) return null;

      try {
        // Try to fetch from server
        const data = await MealPlanAPI.getMealPlan(userId, weekStartDate);
        
        // Cache for offline use
        await MealPlanCache.cacheMealPlan(weekStartDate, data);
        
        return data;
      } catch (error) {
        // Fallback to cached data if offline
        console.warn('Failed to fetch meal plan, trying cache:', error);
        return await MealPlanCache.getCachedMealPlan(weekStartDate);
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a network error and we have cached data
      if (error.message?.includes('network') && failureCount === 0) {
        return false;
      }
      return failureCount < 2;
    }
  });

  // Mutation for generating meal plan
  const generateMealPlanMutation = useMutation({
    mutationFn: async (preferences: MealPlanPreferences) => {
      const userProfile = await getCurrentUserProfile();
      return MealPlanAPI.generateMealPlan(userProfile, preferences);
    },
    onSuccess: (data) => {
      // Update cache with new meal plan
      queryClient.setQueryData(['mealPlan', userId, weekStartDate], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['mealPlan', userId]
      });
      
      // Cache the new plan
      MealPlanCache.cacheMealPlan(weekStartDate, data);
    },
    onError: (error) => {
      console.error('Failed to generate meal plan:', error);
    }
  });

  // Mutation for updating meal completion
  const updateMealMutation = useMutation({
    mutationFn: async ({ mealId, updates }: { mealId: string, updates: any }) => {
      return MealPlanAPI.updateMeal(mealId, updates);
    },
    onSuccess: () => {
      // Refetch current meal plan
      refetch();
    }
  });

  return {
    mealPlan,
    isLoading,
    error,
    refetch,
    generateMealPlan: generateMealPlanMutation.mutate,
    isGenerating: generateMealPlanMutation.isPending,
    updateMeal: updateMealMutation.mutate,
    isUpdating: updateMealMutation.isPending
  };
};

// Helper function to get current user profile
const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};
```

### 2. Offline-First Cache Service
```typescript
// src/features/meal-plan/services/MealPlanCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeeklyMealPlan } from '../types/MealPlan';

interface CachedMealPlan {
  data: WeeklyMealPlan;
  timestamp: number;
  expiresAt: number;
}

export class MealPlanCache {
  private static readonly CACHE_PREFIX = 'meal_plan_';
  private static readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  static async cacheMealPlan(weekStartDate: string, mealPlan: WeeklyMealPlan): Promise<void> {
    try {
      const cacheEntry: CachedMealPlan = {
        data: mealPlan,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };

      await AsyncStorage.setItem(
        `${this.CACHE_PREFIX}${weekStartDate}`,
        JSON.stringify(cacheEntry)
      );

      // Also cache as current week if it's the current week
      if (this.isCurrentWeek(weekStartDate)) {
        await AsyncStorage.setItem(
          `${this.CACHE_PREFIX}current`,
          JSON.stringify(cacheEntry)
        );
      }
    } catch (error) {
      console.warn('Failed to cache meal plan:', error);
    }
  }

  static async getCachedMealPlan(weekStartDate: string): Promise<WeeklyMealPlan | null> {
    try {
      const cached = await AsyncStorage.getItem(`${this.CACHE_PREFIX}${weekStartDate}`);
      if (!cached) return null;

      const cacheEntry: CachedMealPlan = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() > cacheEntry.expiresAt) {
        await this.removeCachedMealPlan(weekStartDate);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to get cached meal plan:', error);
      return null;
    }
  }

  static async getCurrentMealPlan(): Promise<WeeklyMealPlan | null> {
    try {
      const cached = await AsyncStorage.getItem(`${this.CACHE_PREFIX}current`);
      if (!cached) return null;

      const cacheEntry: CachedMealPlan = JSON.parse(cached);

      if (Date.now() > cacheEntry.expiresAt) {
        await AsyncStorage.removeItem(`${this.CACHE_PREFIX}current`);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to get current meal plan:', error);
      return null;
    }
  }

  static async removeCachedMealPlan(weekStartDate: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.CACHE_PREFIX}${weekStartDate}`);
    } catch (error) {
      console.warn('Failed to remove cached meal plan:', error);
    }
  }

  static async clearAllCachedMealPlans(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const mealPlanKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(mealPlanKeys);
    } catch (error) {
      console.warn('Failed to clear meal plan cache:', error);
    }
  }

  static async getCacheInfo(): Promise<{ count: number; totalSize: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const mealPlanKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));

      let totalSize = 0;
      for (const key of mealPlanKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }

      return {
        count: mealPlanKeys.length,
        totalSize
      };
    } catch (error) {
      console.warn('Failed to get cache info:', error);
      return { count: 0, totalSize: 0 };
    }
  }

  private static isCurrentWeek(weekStartDate: string): boolean {
    const today = new Date();
    const currentWeekStart = this.calculateWeekStart(today);
    return weekStartDate === currentWeekStart;
  }

  private static calculateWeekStart(date: Date): string {
    const dayOfWeek = date.getDay();
    const daysToSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek) % 7;
    const saturday = new Date(date);
    saturday.setDate(date.getDate() - dayOfWeek + 6);
    return saturday.toISOString().split('T')[0];
  }
}
```

## 📊 TypeScript Types

### 1. Core Meal Plan Types
```typescript
// src/features/meal-plan/types/MealPlan.ts
export interface WeeklyMealPlan {
  id: string;
  userId: string;
  weekStartDate: string; // YYYY-MM-DD (Saturday)
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  generationPrompt?: MealPlanPreferences;
  lifePhaseContext?: LifePhaseContext;
  dailyMeals: DailyMeal[];
  createdAt: string;
}

export interface DailyMeal {
  id: string;
  weeklyPlanId: string;
  dayNumber: number; // 1-7 (Saturday=1, Friday=7)
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: string[];
  instructions: string[];
  alternatives?: string[];
  youtubeSearchTerm?: string;
  imageUrl?: string;
  recipeFetched: boolean;
  completed?: boolean;
  completedAt?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanPreferences {
  cuisine?: string;
  maxPrepTime?: string;
  includeSnacks: boolean;
  language: 'en' | 'ar';
  weekOffset: number;
}

export interface LifePhaseContext {
  isPregnant?: boolean;
  pregnancyTrimester?: number;
  isBreastfeeding?: boolean;
  breastfeedingLevel?: 'exclusive' | 'partial';
  isMuslimFasting?: boolean;
  fastingType?: string;
  extraCalories: number;
  specialRequirements?: string[];
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealAlternative {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  instructions: string[];
  whyBetter: string;
}
```

## 🌐 Navigation Integration

### 1. Navigation Types
```typescript
// src/types/navigation.ts
export type MealPlanStackParamList = {
  MealPlanHome: undefined;
  MealDetail: {
    mealId: string;
    meal: DailyMeal;
  };
  RecipeDetail: {
    mealId: string;
    mealName: string;
  };
  MealAlternatives: {
    mealId: string;
    currentMeal: DailyMeal;
  };
  GeneratePlan: {
    weekOffset?: number;
  };
};
```

### 2. Navigation Setup
```typescript
// src/navigation/MealPlanNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MealPlanScreen } from '@/features/meal-plan/screens/MealPlanScreen';
import { MealDetailScreen } from '@/features/meal-plan/screens/MealDetailScreen';
import { RecipeScreen } from '@/features/meal-plan/screens/RecipeScreen';
import { MealPlanStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<MealPlanStackParamList>();

export const MealPlanNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="MealPlanHome"
        component={MealPlanScreen}
        options={{
          title: 'Meal Plan',
          headerLargeTitle: true,
        }}
      />
      
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={({ route }) => ({
          title: route.params.meal.name,
        })}
      />
      
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeScreen}
        options={({ route }) => ({
          title: route.params.mealName,
        })}
      />
    </Stack.Navigator>
  );
};
```

This comprehensive React Native implementation guide provides everything needed to build a fully-featured meal planning system with offline support, cultural awareness, and smooth user experience.
