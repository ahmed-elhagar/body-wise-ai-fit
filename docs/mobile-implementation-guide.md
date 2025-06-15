
# React Native/Expo Implementation Guide for FitFatta

This guide provides specific recommendations for implementing the FitFatta fitness platform using React Native and Expo, based on the existing web application architecture.

## 🚀 Project Setup & Architecture

### 1. Recommended Tech Stack

```json
{
  "framework": "Expo (SDK 50+)",
  "navigation": "@react-navigation/native v6",
  "state": "Zustand + React Query",
  "ui": "NativeBase or Tamagui",
  "auth": "@supabase/supabase-js",
  "storage": "AsyncStorage + MMKV",
  "notifications": "Expo Notifications",
  "camera": "Expo Camera + Image Picker",
  "payments": "react-native-iap",
  "charts": "Victory Native or React Native Chart Kit",
  "animations": "React Native Reanimated 3"
}
```

### 2. Project Structure

```
src/
├── features/                    # Feature-based architecture (CRITICAL)
│   ├── meal-plan/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── exercise/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   └── services/
│   ├── auth/
│   ├── profile/
│   ├── tracking/
│   └── ai-assistant/
├── shared/
│   ├── components/             # Shared UI components only
│   ├── hooks/                 # Global hooks only
│   ├── services/              # API clients, utilities
│   ├── constants/             # App constants
│   └── types/                 # Global types
├── navigation/
├── contexts/                  # React contexts
└── utils/
```

**IMPORTANT**: Follow the exact feature-based structure from the web app. Do NOT put feature-specific components in shared folders.

### 3. Environment Configuration

```javascript
// app.config.js
export default {
  expo: {
    name: "FitFatta",
    slug: "fitfatta",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fitfatta.mobile"
    },
    android: {
      package: "com.fitfatta.mobile",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    },
    plugins: [
      "expo-camera",
      "expo-image-picker",
      "expo-notifications",
      "@react-native-async-storage/async-storage"
    ]
  }
};
```

## 📱 Core Features Implementation

### 1. Authentication System

```typescript
// src/features/auth/services/AuthService.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

export class AuthService {
  static async signUp(email: string, password: string, profile: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName
        }
      }
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  static async signOut() {
    await AsyncStorage.clear(); // Clear all cached data
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}
```

### 2. Offline-First Data Architecture

```typescript
// src/shared/services/OfflineDataManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

export class OfflineDataManager {
  private static syncQueue: any[] = [];
  
  static async storeData(key: string, data: any, syncable = false) {
    const storageItem = {
      data,
      timestamp: Date.now(),
      syncable,
      synced: !syncable
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(storageItem));
    
    if (syncable) {
      this.addToSyncQueue(key, data);
    }
  }
  
  static async getData(key: string) {
    const item = await AsyncStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    return parsed.data;
  }
  
  static async addToSyncQueue(operation: string, data: any) {
    this.syncQueue.push({
      operation,
      data,
      timestamp: Date.now()
    });
    
    const isConnected = await NetInfo.fetch();
    if (isConnected.isConnected) {
      await this.processSyncQueue();
    }
  }
  
  static async processSyncQueue() {
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      try {
        await this.syncOperation(item);
      } catch (error) {
        console.log('Sync failed, re-queuing:', error);
        this.syncQueue.unshift(item);
        break;
      }
    }
  }
  
  private static async syncOperation(item: any) {
    // Implement sync logic with Supabase
    switch (item.operation) {
      case 'weight_entry':
        await supabase.from('weight_entries').insert(item.data);
        break;
      case 'exercise_completion':
        await supabase.from('exercises').update({ completed: true }).eq('id', item.data.exerciseId);
        break;
      case 'meal_completion':
        await supabase.from('daily_meals').update({ completed: true }).eq('id', item.data.mealId);
        break;
    }
  }
}
```

### 3. Meal Planning Implementation

```typescript
// src/features/meal-plan/screens/MealPlanScreen.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useMealPlanData } from '../hooks/useMealPlanData';
import { MealPlanHeader } from '../components/MealPlanHeader';
import { DaySelector } from '../components/DaySelector';
import { MealsList } from '../components/MealsList';
import { useLanguage } from '../../../shared/hooks/useLanguage';

export const MealPlanScreen = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [weekOffset, setWeekOffset] = useState(0);
  const { t, isRTL } = useLanguage();
  
  const {
    mealPlan,
    isLoading,
    error,
    refetch,
    generateNewPlan
  } = useMealPlanData(weekOffset);

  const todaysMeals = mealPlan?.days?.find(day => day.dayNumber === selectedDay)?.meals || [];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <MealPlanHeader
        mealPlan={mealPlan}
        onGenerateNew={generateNewPlan}
        isLoading={isLoading}
      />
      
      <DaySelector
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        weekOffset={weekOffset}
        onWeekChange={setWeekOffset}
        isRTL={isRTL}
      />
      
      <MealsList
        meals={todaysMeals}
        selectedDay={selectedDay}
        isLoading={isLoading}
        error={error}
      />
    </ScrollView>
  );
};
```

### 4. Exercise Tracking with Timer

```typescript
// src/features/exercise/components/ExerciseTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface ExerciseTimerProps {
  exercise: Exercise;
  onComplete: (data: ExerciseCompletionData) => void;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ exercise, onComplete }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft === 0) {
      handleRestComplete();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isResting, restTimeLeft]);
  
  const handleSetComplete = async (reps: number) => {
    const newCompletedSets = [...completedSets, reps];
    setCompletedSets(newCompletedSets);
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentSet < exercise.sets) {
      // Start rest timer
      setIsResting(true);
      setRestTimeLeft(exercise.restSeconds || 60);
      
      // Play rest sound
      await playSound('rest_start');
    } else {
      // Exercise complete
      onComplete({
        exerciseId: exercise.id,
        completedSets: newCompletedSets,
        totalTime: calculateTotalTime(),
        notes: ''
      });
      
      await playSound('exercise_complete');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleRestComplete = async () => {
    setIsResting(false);
    setCurrentSet(prev => prev + 1);
    await playSound('rest_complete');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  
  const playSound = async (soundType: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        soundType === 'rest_start' ? require('../../../assets/sounds/rest_start.mp3') :
        soundType === 'rest_complete' ? require('../../../assets/sounds/rest_complete.mp3') :
        require('../../../assets/sounds/exercise_complete.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  };
  
  return (
    <View style={styles.timerContainer}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.setInfo}>Set {currentSet} of {exercise.sets}</Text>
      
      {isResting ? (
        <View style={styles.restContainer}>
          <Text style={styles.restTitle}>Rest Time</Text>
          <Text style={styles.restTimer}>{formatTime(restTimeLeft)}</Text>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setRestTimeLeft(0)}
          >
            <Text style={styles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.setContainer}>
          <Text style={styles.repsTarget}>Target: {exercise.reps} reps</Text>
          <RepCounter
            targetReps={parseInt(exercise.reps)}
            onComplete={handleSetComplete}
          />
        </View>
      )}
    </View>
  );
};
```

### 5. Food Photo Analysis

```typescript
// src/features/tracking/components/FoodPhotoAnalyzer.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useFoodAnalysis } from '../hooks/useFoodAnalysis';

export const FoodPhotoAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { analyzeFood, isAnalyzing, analysisResult } = useFoodAnalysis();
  
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  };
  
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Camera access is required to take photos');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await analyzeFood(result.assets[0].uri);
    }
  };
  
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await analyzeFood(result.assets[0].uri);
    }
  };
  
  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
      
      {isAnalyzing && (
        <View style={styles.analysisContainer}>
          <ActivityIndicator size="large" />
          <Text>Analyzing your food...</Text>
        </View>
      )}
      
      {analysisResult && (
        <FoodAnalysisResults 
          results={analysisResult}
          onSave={handleSaveToLog}
        />
      )}
    </View>
  );
};
```

### 6. Push Notifications System

```typescript
// src/shared/services/NotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export class NotificationService {
  static async initialize() {
    if (!Device.isDevice) return;
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission for notifications was denied');
      return;
    }
    
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    
    // Get Expo push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await this.saveTokenToDatabase(token);
    
    return token;
  }
  
  static async scheduleWorkoutReminder(time: Date, workoutName: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Workout Reminder 💪",
        body: `Time for your ${workoutName} workout!`,
        data: { type: 'workout_reminder' },
        sound: 'default',
      },
      trigger: {
        date: time,
        repeats: false,
      },
    });
  }
  
  static async scheduleMealReminder(time: Date, mealType: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Time 🍽️`,
        body: "Don't forget to log your meal!",
        data: { type: 'meal_reminder', mealType },
        sound: 'default',
      },
      trigger: {
        date: time,
        repeats: true,
      },
    });
  }
  
  static async scheduleWeightTrackingReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weekly Weigh-in ⚖️",
        body: "Time to track your progress!",
        data: { type: 'weight_tracking' },
      },
      trigger: {
        weekday: 1, // Monday
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  }
  
  private static async saveTokenToDatabase(token: string) {
    // Save to user profile for sending targeted notifications
    const user = await AuthService.getCurrentUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', user.id);
    }
  }
}
```

## 🌐 Multi-Language & RTL Support

### 1. Language Context Implementation

```typescript
// src/shared/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

// Import translation files
import enTranslations from '../translations/en';
import arTranslations from '../translations/ar';

const translations = {
  en: enTranslations,
  ar: arTranslations
};

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  
  useEffect(() => {
    loadSavedLanguage();
  }, []);
  
  const loadSavedLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        setLanguageState(savedLang);
        
        // Set RTL for Arabic
        const isRTL = savedLang === 'ar';
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          
          // Restart app to apply RTL changes
          if (!__DEV__) {
            Updates.reloadAsync();
          }
        }
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };
  
  const setLanguage = async (lang: 'en' | 'ar') => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
      
      const isRTL = lang === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        
        // Restart app to apply RTL changes
        if (!__DEV__) {
          Updates.reloadAsync();
        }
      }
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };
  
  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey] || match;
      });
    }
    
    return value;
  };
  
  const isRTL = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
```

### 2. RTL-Aware Components

```typescript
// src/shared/components/RTLView.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface RTLViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  rtlStyle?: ViewStyle;
}

export const RTLView: React.FC<RTLViewProps> = ({ children, style, rtlStyle }) => {
  const { isRTL } = useLanguage();
  
  const combinedStyle = [
    style,
    isRTL && rtlStyle,
    isRTL && { flexDirection: 'row-reverse' }
  ];
  
  return <View style={combinedStyle}>{children}</View>;
};

// RTL-aware Text component
export const RTLText: React.FC<TextProps> = ({ style, ...props }) => {
  const { isRTL } = useLanguage();
  
  const textStyle = [
    style,
    isRTL && { textAlign: 'right', writingDirection: 'rtl' }
  ];
  
  return <Text style={textStyle} {...props} />;
};
```

## 📊 Performance Optimization

### 1. Image Optimization

```typescript
// src/shared/components/OptimizedImage.tsx
import React, { useState } from 'react';
import { Image, ImageStyle, ActivityIndicator, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: ImageStyle;
  placeholder?: string;
  blurhash?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  placeholder,
  blurhash
}) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <View style={style}>
      <ExpoImage
        source={source}
        style={[style, { position: 'absolute' }]}
        placeholder={blurhash}
        contentFit="cover"
        transition={200}
        onLoad={() => setLoading(false)}
      />
      
      {loading && (
        <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
};
```

### 2. List Performance

```typescript
// src/shared/components/PerformantList.tsx
import React, { useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

interface PerformantListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  estimatedItemSize?: number;
}

export function PerformantList<T>({
  data,
  renderItem,
  keyExtractor,
  estimatedItemSize = 100
}: PerformantListProps<T>) {
  const memoizedData = useMemo(() => data, [data]);
  
  return (
    <FlatList
      data={memoizedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: estimatedItemSize,
        offset: estimatedItemSize * index,
        index
      })}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### 3. State Management with Zustand

```typescript
// src/shared/stores/useAppStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  user: User | null;
  mealPlan: MealPlan | null;
  exerciseProgram: ExerciseProgram | null;
  preferences: UserPreferences;
  
  // Actions
  setUser: (user: User | null) => void;
  setMealPlan: (plan: MealPlan) => void;
  setExerciseProgram: (program: ExerciseProgram) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    immer((set) => ({
      user: null,
      mealPlan: null,
      exerciseProgram: null,
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true,
        units: 'metric'
      },
      
      setUser: (user) => set((state) => {
        state.user = user;
      }),
      
      setMealPlan: (plan) => set((state) => {
        state.mealPlan = plan;
      }),
      
      setExerciseProgram: (program) => set((state) => {
        state.exerciseProgram = program;
      }),
      
      updatePreferences: (newPreferences) => set((state) => {
        Object.assign(state.preferences, newPreferences);
      })
    }))
  )
);

// Persist store to AsyncStorage
useAppStore.subscribe(
  (state) => state.user,
  (user) => {
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('user');
    }
  }
);
```

## 🚀 Deployment & App Store Guidelines

### 1. Build Configuration

```javascript
// eas.json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "@fitfatta-supabase-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "@fitfatta-supabase-anon-key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. App Store Optimization

```markdown
# App Store Listing

**Title**: FitFatta - AI Fitness & Nutrition

**Subtitle**: Personalized meal plans & workouts

**Keywords**: fitness, nutrition, meal planning, workout tracker, AI personal trainer, diet app, exercise program, weight loss, muscle gain, healthy eating

**Description**:
Transform your fitness journey with FitFatta's AI-powered personalized approach to nutrition and exercise.

🍽️ SMART MEAL PLANNING
• AI-generated 7-day meal plans
• Cultural cuisine preferences
• Dietary restrictions & allergies support
• Pregnancy & breastfeeding nutrition
• Islamic fasting meal timing

💪 PERSONALIZED WORKOUTS
• Progressive 4-week exercise programs
• Home & gym workout options
• Equipment-based exercise selection
• Real-time workout timer & tracking

📸 AI FOOD ANALYSIS
• Snap photos to track nutrition
• Automatic calorie & macro counting
• Extensive food database

📊 PROGRESS TRACKING
• Weight & body composition tracking
• Workout performance analytics
• Meal completion tracking
• Visual progress charts

🌍 CULTURAL AWARENESS
• Arabic & English language support
• Right-to-left (RTL) interface
• Regional food preferences
• Islamic lifestyle considerations

Download FitFatta today and start your personalized fitness transformation!
```

### 3. Performance Monitoring

```typescript
// src/shared/services/AnalyticsService.ts
import * as Analytics from 'expo-analytics-amplitude';
import crashlytics from '@react-native-firebase/crashlytics';

export class AnalyticsService {
  static async initialize() {
    await Analytics.initializeAsync('your-amplitude-key');
  }
  
  static async trackEvent(eventName: string, properties?: Record<string, any>) {
    await Analytics.logEventAsync(eventName, properties);
  }
  
  static async trackScreenView(screenName: string) {
    await Analytics.logEventAsync('screen_view', { screen: screenName });
  }
  
  static async trackUserProperty(property: string, value: any) {
    await Analytics.setUserPropertyAsync(property, value);
  }
  
  static async logError(error: Error, context?: string) {
    console.error('App Error:', error);
    crashlytics().recordError(error);
    
    await Analytics.logEventAsync('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }
}
```

This comprehensive implementation guide provides the foundation for building a production-ready React Native/Expo version of FitFatta while maintaining feature parity with the web application and following mobile best practices.
