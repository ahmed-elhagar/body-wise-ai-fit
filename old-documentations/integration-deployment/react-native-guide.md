
# React Native & Expo Integration Guide

Comprehensive guide for implementing FitFatta features in React Native/Expo applications with optimized performance and offline capabilities.

## 🏗️ Project Setup & Architecture

### Expo Configuration
```typescript
// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FitFatta',
  slug: 'fitfatta',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/your-project-id'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fitfatta.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses camera to analyze food photos',
      NSMicrophoneUsageDescription: 'This app uses microphone for voice commands',
      NSLocationWhenInUseUsageDescription: 'This app uses location for personalized content'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.fitfatta.app',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'ACCESS_FINE_LOCATION',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-camera',
    'expo-image-picker',
    'expo-notifications',
    'expo-secure-store',
    'expo-sqlite',
    '@react-native-async-storage/async-storage',
    [
      'expo-build-properties',
      {
        ios: {
          newArchEnabled: true
        },
        android: {
          newArchEnabled: true
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  }
});
```

### Core Dependencies
```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/drawer": "^6.6.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.0.0",
    "expo": "~49.0.0",
    "expo-camera": "~13.4.0",
    "expo-image-picker": "~14.3.0",
    "expo-notifications": "~0.20.0",
    "expo-secure-store": "~12.3.0",
    "expo-sqlite": "~11.3.0",
    "expo-constants": "~14.4.0",
    "expo-device": "~5.4.0",
    "expo-font": "~11.4.0",
    "expo-splash-screen": "~0.20.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-reanimated": "~3.3.0",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "react-hook-form": "^7.45.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-progress": "^5.0.0",
    "@react-native-community/netinfo": "^9.4.0"
  }
}
```

## 🔐 Authentication & Supabase Setup

### Supabase Client Configuration
```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

### Authentication Hook
```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      } else {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
    
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
    
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};
```

## 📱 Core Features Implementation

### Meal Plan Feature
```typescript
// hooks/useMealPlan.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface MealPlan {
  id: string;
  weekStartDate: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: DailyMeal[];
}

export const useMealPlan = (weekStartDate: string) => {
  const queryClient = useQueryClient();

  const mealPlanQuery = useQuery({
    queryKey: ['mealPlan', weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select(`
          *,
          daily_meals (
            *
          )
        `)
        .eq('week_start_date', weekStartDate)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const generateMealPlan = useMutation({
    mutationFn: async (preferences: MealPlanPreferences) => {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          weekStartDate,
          preferences,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', weekStartDate] });
    },
  });

  return {
    mealPlan: mealPlanQuery.data,
    isLoading: mealPlanQuery.isLoading,
    error: mealPlanQuery.error,
    generateMealPlan: generateMealPlan.mutate,
    isGenerating: generateMealPlan.isPending,
  };
};
```

### Food Tracking Feature
```typescript
// hooks/useFoodTracker.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useFoodTracker = (date: string) => {
  const queryClient = useQueryClient();

  const dailyLogQuery = useQuery({
    queryKey: ['foodLog', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          *,
          food_items (
            name,
            brand,
            category,
            image_url
          )
        `)
        .gte('consumed_at', `${date}T00:00:00.000Z`)
        .lt('consumed_at', `${date}T23:59:59.999Z`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const nutritionSummaryQuery = useQuery({
    queryKey: ['nutritionSummary', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_nutrition_summaries')
        .select('*')
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const logFood = useMutation({
    mutationFn: async (foodData: FoodConsumptionData) => {
      const { data, error } = await supabase.rpc('log_food_consumption', {
        user_id_param: foodData.userId,
        food_item_id_param: foodData.foodItemId,
        quantity_g_param: foodData.quantityG,
        meal_type_param: foodData.mealType,
        consumed_at_param: foodData.consumedAt,
        source_param: foodData.source,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodLog', date] });
      queryClient.invalidateQueries({ queryKey: ['nutritionSummary', date] });
    },
  });

  return {
    dailyLog: dailyLogQuery.data || [],
    nutritionSummary: nutritionSummaryQuery.data,
    isLoading: dailyLogQuery.isLoading || nutritionSummaryQuery.isLoading,
    logFood: logFood.mutate,
    isLoggingFood: logFood.isPending,
  };
};
```

### Exercise Program Feature
```typescript
// hooks/useExerciseProgram.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useExerciseProgram = () => {
  const queryClient = useQueryClient();

  const currentProgramQuery = useQuery({
    queryKey: ['currentExerciseProgram'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_current_exercise_program', {
        user_id_param: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      return data;
    },
  });

  const generateProgram = useMutation({
    mutationFn: async (preferences: ExercisePreferences) => {
      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          preferences,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentExerciseProgram'] });
    },
  });

  return {
    currentProgram: currentProgramQuery.data,
    isLoading: currentProgramQuery.isLoading,
    generateProgram: generateProgram.mutate,
    isGenerating: generateProgram.isPending,
  };
};
```

## 📸 Camera & Photo Analysis

### Camera Component
```typescript
// components/CameraComponent.tsx
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CameraComponentProps {
  onPhotoTaken: (uri: string) => void;
  onClose: () => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPhotoTaken(photo.uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoTaken(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

### Food Photo Analysis Hook
```typescript
// hooks/useFoodPhotoAnalysis.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useFoodPhotoAnalysis = () => {
  const analyzePhoto = useMutation({
    mutationFn: async ({ imageUri, mealType }: { imageUri: string; mealType: string }) => {
      // Upload image to Supabase Storage
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'food_photo.jpg',
      } as any);

      const fileName = `${Date.now()}_food_photo.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food-photos')
        .upload(fileName, formData);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('food-photos')
        .getPublicUrl(fileName);

      // Analyze photo with AI
      const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
        body: {
          imageUrl: publicUrl,
          mealType,
        },
      });

      if (error) throw error;
      return data;
    },
  });

  return {
    analyzePhoto: analyzePhoto.mutate,
    isAnalyzing: analyzePhoto.isPending,
    error: analyzePhoto.error,
    result: analyzePhoto.data,
  };
};
```

## 🔔 Push Notifications

### Notification Setup
```typescript
// hooks/useNotifications.ts
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // Save token to database
        savePushToken(token);
      }
    });

    // Listen for notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    return token;
  };

  const savePushToken = async (token: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('push_notification_tokens')
      .upsert({
        user_id: user.id,
        token,
        platform: Platform.OS,
        device_id: Device.deviceName || 'unknown',
        is_active: true,
      });
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    if (data.actionType === 'navigate' && data.actionUrl) {
      // Navigate to specific screen
      // navigation.navigate(data.actionUrl);
    }
  };

  return {
    expoPushToken,
  };
};
```

## 💾 Offline Support & Caching

### Offline Storage Hook
```typescript
// hooks/useOfflineStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      // When coming back online, sync pending data
      if (state.isConnected) {
        syncPendingData();
      }
    });

    loadPendingSync();

    return unsubscribe;
  }, []);

  const saveOffline = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const loadOffline = async <T>(key: string): Promise<T | null> => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading offline data:', error);
      return null;
    }
  };

  const queueForSync = async (action: any) => {
    const queue = await loadOffline<any[]>('sync_queue') || [];
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: `${Date.now()}_${Math.random()}`,
    });
    await saveOffline('sync_queue', queue);
    setPendingSync(queue);
  };

  const loadPendingSync = async () => {
    const queue = await loadOffline<any[]>('sync_queue') || [];
    setPendingSync(queue);
  };

  const syncPendingData = async () => {
    const queue = await loadOffline<any[]>('sync_queue') || [];
    
    for (const item of queue) {
      try {
        // Process sync item based on type
        await processSyncItem(item);
        
        // Remove from queue after successful sync
        const updatedQueue = queue.filter(q => q.id !== item.id);
        await saveOffline('sync_queue', updatedQueue);
        setPendingSync(updatedQueue);
      } catch (error) {
        console.error('Error syncing item:', error);
      }
    }
  };

  const processSyncItem = async (item: any) => {
    switch (item.type) {
      case 'food_log':
        await supabase.rpc('log_food_consumption', item.data);
        break;
      case 'exercise_completion':
        await supabase
          .from('exercises')
          .update(item.data)
          .eq('id', item.id);
        break;
      default:
        console.warn('Unknown sync item type:', item.type);
    }
  };

  return {
    isOnline,
    pendingSync,
    saveOffline,
    loadOffline,
    queueForSync,
    syncPendingData,
  };
};
```

## 🎨 Theme & Localization

### Theme Provider
```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6D6D80',
  border: '#C6C6C8',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const darkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

This comprehensive React Native integration guide provides the foundation for implementing all FitFatta features with proper performance optimization, offline support, and native mobile capabilities.
