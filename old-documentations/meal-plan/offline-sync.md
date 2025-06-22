# Meal Plan Offline & Sync Strategy

Complete guide for implementing offline-first meal plan functionality with robust synchronization in React Native/Expo.

## 🔄 Offline-First Architecture

### 1. Data Flow Strategy
```
Online:  Server ←→ React Query ←→ UI
Offline: AsyncStorage ←→ React Query ←→ UI
Sync:    AsyncStorage ←→ Queue ←→ Server
```

### 2. Storage Layers
```typescript
// src/features/meal-plan/services/StorageManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

interface StorageLayer {
  priority: number;
  type: 'cache' | 'queue' | 'settings';
  data: any;
  timestamp: number;
  expiresAt?: number;
}

export class MealPlanStorageManager {
  private static readonly STORAGE_KEYS = {
    // Cache keys
    MEAL_PLAN_CACHE: 'meal_plan_cache_',
    CURRENT_WEEK: 'meal_plan_current',
    USER_PREFERENCES: 'meal_plan_preferences',
    
    // Sync queue keys
    PENDING_GENERATIONS: 'meal_plan_pending_generations',
    PENDING_UPDATES: 'meal_plan_pending_updates',
    SYNC_FAILURES: 'meal_plan_sync_failures',
    
    // Metadata
    LAST_SYNC: 'meal_plan_last_sync',
    OFFLINE_CHANGES: 'meal_plan_offline_changes'
  };

  // Cache Management
  static async cacheWeeklyPlan(
    weekStartDate: string, 
    mealPlan: WeeklyMealPlan,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<void> {
    const storageLayer: StorageLayer = {
      priority: this.getPriorityValue(priority),
      type: 'cache',
      data: mealPlan,
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };

    await AsyncStorage.setItem(
      `${this.STORAGE_KEYS.MEAL_PLAN_CACHE}${weekStartDate}`,
      JSON.stringify(storageLayer)
    );

    // Also cache as current if it's this week
    if (this.isCurrentWeek(weekStartDate)) {
      await this.setCurrentWeekPlan(mealPlan);
    }

    // Cleanup old cache if storage is getting full
    await this.cleanupOldCache();
  }

  static async getCachedWeeklyPlan(weekStartDate: string): Promise<WeeklyMealPlan | null> {
    try {
      const cached = await AsyncStorage.getItem(
        `${this.STORAGE_KEYS.MEAL_PLAN_CACHE}${weekStartDate}`
      );
      
      if (!cached) return null;

      const storageLayer: StorageLayer = JSON.parse(cached);

      // Check expiration
      if (storageLayer.expiresAt && Date.now() > storageLayer.expiresAt) {
        await this.removeCachedPlan(weekStartDate);
        return null;
      }

      return storageLayer.data;
    } catch (error) {
      console.warn('Failed to get cached meal plan:', error);
      return null;
    }
  }

  // Priority-based cache cleanup
  static async cleanupOldCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => 
        key.startsWith(this.STORAGE_KEYS.MEAL_PLAN_CACHE)
      );

      if (cacheKeys.length <= 10) return; // Keep up to 10 weeks cached

      // Get all cached items with metadata
      const cachedItems = await Promise.all(
        cacheKeys.map(async key => {
          const data = await AsyncStorage.getItem(key);
          return { key, data: data ? JSON.parse(data) : null };
        })
      );

      // Sort by priority and age, remove lowest priority/oldest items
      const sortedItems = cachedItems
        .filter(item => item.data)
        .sort((a, b) => {
          const priorityDiff = b.data.priority - a.data.priority;
          if (priorityDiff !== 0) return priorityDiff;
          return b.data.timestamp - a.data.timestamp;
        });

      // Remove excess items
      const itemsToRemove = sortedItems.slice(8); // Keep top 8
      await AsyncStorage.multiRemove(itemsToRemove.map(item => item.key));

    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  }

  private static getPriorityValue(priority: string): number {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[priority] || 2;
  }

  private static isCurrentWeek(weekStartDate: string): boolean {
    const today = new Date();
    const currentWeekStart = this.calculateWeekStart(today);
    return weekStartDate === currentWeekStart;
  }

  private static calculateWeekStart(date: Date): string {
    const dayOfWeek = date.getDay();
    const saturday = new Date(date);
    saturday.setDate(date.getDate() - dayOfWeek + 6);
    return saturday.toISOString().split('T')[0];
  }
}
```

## 📤 Sync Queue Management

### 1. Operation Queue System
```typescript
// src/features/meal-plan/services/SyncQueue.ts
interface QueuedOperation {
  id: string;
  type: 'generate' | 'update' | 'complete' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'medium' | 'low';
  userId: string;
}

export class MealPlanSyncQueue {
  private static queue: QueuedOperation[] = [];
  private static isProcessing = false;
  private static readonly MAX_QUEUE_SIZE = 50;

  // Add operation to queue
  static async queueOperation(
    type: QueuedOperation['type'],
    data: any,
    priority: 'high' | 'medium' | 'low' = 'medium',
    userId: string
  ): Promise<string> {
    const operation: QueuedOperation = {
      id: this.generateOperationId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: type === 'generate' ? 3 : 5,
      priority,
      userId
    };

    // Load existing queue
    await this.loadQueue();

    // Add to queue with priority sorting
    this.queue.push(operation);
    this.queue.sort((a, b) => {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority] - priorityValues[a.priority];
    });

    // Limit queue size
    if (this.queue.length > this.MAX_QUEUE_SIZE) {
      this.queue = this.queue.slice(0, this.MAX_QUEUE_SIZE);
    }

    // Persist queue
    await this.saveQueue();

    // Start processing if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.processQueue();
    }

    return operation.id;
  }

  // Process queue when online
  static async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    this.isProcessing = true;

    try {
      await this.loadQueue();

      while (this.queue.length > 0) {
        const operation = this.queue.shift()!;

        try {
          await this.executeOperation(operation);
          console.log(`✅ Sync operation completed: ${operation.type}`);
        } catch (error) {
          console.warn(`❌ Sync operation failed: ${operation.type}`, error);
          
          operation.retryCount++;
          
          if (operation.retryCount < operation.maxRetries) {
            // Re-queue with exponential backoff
            setTimeout(() => {
              this.queue.unshift(operation);
            }, Math.pow(2, operation.retryCount) * 1000);
          } else {
            // Move to failed operations
            await this.moveToFailedOperations(operation, error);
          }
        }

        // Save progress
        await this.saveQueue();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Execute individual operation
  private static async executeOperation(operation: QueuedOperation): Promise<void> {
    const { type, data, userId } = operation;

    switch (type) {
      case 'generate':
        return this.executeMealPlanGeneration(data, userId);
      
      case 'update':
        return this.executeMealUpdate(data, userId);
      
      case 'complete':
        return this.executeMealCompletion(data, userId);
      
      case 'delete':
        return this.executeMealDeletion(data, userId);
      
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  private static async executeMealPlanGeneration(data: any, userId: string): Promise<void> {
    const response = await supabase.functions.invoke('generate-meal-plan', {
      body: {
        userData: data.userProfile,
        preferences: data.preferences
      }
    });

    if (response.error) throw response.error;

    // Update local cache with generated plan
    const weekStartDate = data.preferences.weekOffset 
      ? this.calculateWeekWithOffset(data.preferences.weekOffset)
      : this.calculateWeekStart(new Date());
      
    await MealPlanStorageManager.cacheWeeklyPlan(
      weekStartDate,
      response.data,
      'high'
    );
  }

  private static async executeMealUpdate(data: any, userId: string): Promise<void> {
    const { mealId, updates } = data;
    
    const { error } = await supabase
      .from('daily_meals')
      .update(updates)
      .eq('id', mealId);

    if (error) throw error;
  }

  private static async executeMealCompletion(data: any, userId: string): Promise<void> {
    const { mealId, completed, completedAt } = data;
    
    const { error } = await supabase
      .from('daily_meals')
      .update({ 
        completed, 
        completed_at: completedAt 
      })
      .eq('id', mealId);

    if (error) throw error;
  }

  // Queue persistence
  private static async loadQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(
        MealPlanStorageManager.STORAGE_KEYS.PENDING_UPDATES
      );
      
      this.queue = queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.warn('Failed to load sync queue:', error);
      this.queue = [];
    }
  }

  private static async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        MealPlanStorageManager.STORAGE_KEYS.PENDING_UPDATES,
        JSON.stringify(this.queue)
      );
    } catch (error) {
      console.warn('Failed to save sync queue:', error);
    }
  }

  // Utility methods
  private static generateOperationId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async moveToFailedOperations(
    operation: QueuedOperation, 
    error: any
  ): Promise<void> {
    try {
      const failedOps = await AsyncStorage.getItem(
        MealPlanStorageManager.STORAGE_KEYS.SYNC_FAILURES
      );
      
      const failures = failedOps ? JSON.parse(failedOps) : [];
      failures.push({
        operation,
        error: error.message || 'Unknown error',
        failedAt: new Date().toISOString()
      });

      await AsyncStorage.setItem(
        MealPlanStorageManager.STORAGE_KEYS.SYNC_FAILURES,
        JSON.stringify(failures)
      );
    } catch (storageError) {
      console.warn('Failed to store failed operation:', storageError);
    }
  }
}
```

## 🔄 Network State Management

### 1. Connection Monitoring
```typescript
// src/features/meal-plan/hooks/useNetworkSync.ts
import { useEffect, useState, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-netinfo/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import { MealPlanSyncQueue } from '../services/SyncQueue';

interface NetworkSyncState {
  isOnline: boolean;
  isWifiConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingOperations: number;
  syncProgress: number;
}

export const useNetworkSync = (userId: string) => {
  const [syncState, setSyncState] = useState<NetworkSyncState>({
    isOnline: false,
    isWifiConnected: false,
    isSyncing: false,
    lastSyncTime: null,
    pendingOperations: 0,
    syncProgress: 0
  });

  // Network state monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isOnline = state.isConnected && state.isInternetReachable;
      const isWifiConnected = state.type === 'wifi' && isOnline;

      setSyncState(prev => ({
        ...prev,
        isOnline,
        isWifiConnected
      }));

      // Trigger sync when coming online
      if (isOnline && !syncState.isOnline) {
        handleNetworkReconnect();
      }
    });

    return unsubscribe;
  }, [syncState.isOnline]);

  // App state monitoring for background sync
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && syncState.isOnline) {
        // App came to foreground and we're online
        handleAppForeground();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [syncState.isOnline]);

  // Handle network reconnection
  const handleNetworkReconnect = useCallback(async () => {
    if (syncState.isSyncing) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, syncProgress: 0 }));

    try {
      // Get pending operations count
      const pendingCount = await MealPlanSyncQueue.getPendingOperationsCount();
      setSyncState(prev => ({ ...prev, pendingOperations: pendingCount }));

      // Process sync queue with progress tracking
      await MealPlanSyncQueue.processQueueWithProgress((progress) => {
        setSyncState(prev => ({ ...prev, syncProgress: progress }));
      });

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        pendingOperations: 0,
        syncProgress: 100
      }));

      // Update last sync time in storage
      await AsyncStorage.setItem(
        'meal_plan_last_sync',
        new Date().toISOString()
      );

    } catch (error) {
      console.warn('Sync failed:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncProgress: 0
      }));
    }
  }, [syncState.isSyncing]);

  // Handle app coming to foreground
  const handleAppForeground = useCallback(async () => {
    // Check if we need to sync (last sync was more than 30 minutes ago)
    const lastSync = await AsyncStorage.getItem('meal_plan_last_sync');
    if (lastSync) {
      const lastSyncTime = new Date(lastSync);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      if (lastSyncTime < thirtyMinutesAgo) {
        handleNetworkReconnect();
      }
    } else {
      handleNetworkReconnect();
    }
  }, [handleNetworkReconnect]);

  // Manual sync trigger
  const triggerManualSync = useCallback(async () => {
    if (!syncState.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await handleNetworkReconnect();
  }, [syncState.isOnline, handleNetworkReconnect]);

  return {
    ...syncState,
    triggerManualSync
  };
};
```

## 💾 Smart Caching Strategy

### 1. Cache Priority System
```typescript
// src/features/meal-plan/services/CacheStrategy.ts
interface CacheEntry {
  data: any;
  priority: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  tags: string[];
}

export class SmartCacheStrategy {
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly CACHE_PRIORITIES = {
    CURRENT_WEEK: 10,
    NEXT_WEEK: 8,
    PREVIOUS_WEEK: 6,
    USER_PREFERENCES: 9,
    FREQUENTLY_ACCESSED: 7,
    RARELY_ACCESSED: 3
  };

  // Intelligent cache management
  static async optimizeCache(): Promise<void> {
    const cacheInfo = await this.getCacheAnalytics();
    
    if (cacheInfo.totalSize < this.MAX_CACHE_SIZE) return;

    // Get all cache entries
    const entries = await this.getAllCacheEntries();
    
    // Score entries based on multiple factors
    const scoredEntries = entries.map(entry => ({
      ...entry,
      score: this.calculateCacheScore(entry)
    }));

    // Sort by score (highest = keep, lowest = remove)
    scoredEntries.sort((a, b) => b.score - a.score);

    // Keep top 70% by size
    let currentSize = 0;
    const targetSize = this.MAX_CACHE_SIZE * 0.7;
    const entriesToKeep = [];

    for (const entry of scoredEntries) {
      if (currentSize + entry.size <= targetSize) {
        entriesToKeep.push(entry);
        currentSize += entry.size;
      } else {
        // Remove this entry
        await this.removeCacheEntry(entry.key);
      }
    }

    console.log(`Cache optimized: kept ${entriesToKeep.length}/${entries.length} entries`);
  }

  private static calculateCacheScore(entry: CacheEntry): number {
    const { priority, accessCount, lastAccessed, size } = entry;
    
    // Time factor (more recent = higher score)
    const timeFactor = Math.max(0, 1 - (Date.now() - lastAccessed) / (7 * 24 * 60 * 60 * 1000));
    
    // Access frequency factor
    const accessFactor = Math.min(1, accessCount / 10);
    
    // Size factor (smaller = better)
    const sizeFactor = Math.max(0, 1 - size / (5 * 1024 * 1024)); // 5MB baseline
    
    // Priority factor (0-1 normalized)
    const priorityFactor = priority / 10;

    // Weighted combination
    return (
      priorityFactor * 0.4 +
      timeFactor * 0.3 +
      accessFactor * 0.2 +
      sizeFactor * 0.1
    );
  }

  // Preemptive caching for next week
  static async preloadNextWeekData(userId: string): Promise<void> {
    const nextWeekStart = this.calculateWeekStart(new Date(), 1);
    
    // Check if already cached
    const cached = await MealPlanStorageManager.getCachedWeeklyPlan(nextWeekStart);
    if (cached) return;

    // Queue for background generation if user has credits
    const userCredits = await this.getUserCredits(userId);
    if (userCredits > 0) {
      await MealPlanSyncQueue.queueOperation(
        'generate',
        {
          userProfile: await this.getUserProfile(userId),
          preferences: {
            weekOffset: 1,
            includeSnacks: true,
            language: 'en'
          }
        },
        'low', // Low priority background task
        userId
      );
    }
  }

  // Cache warming for frequently accessed data
  static async warmCache(userId: string): Promise<void> {
    const warmingTasks = [
      // Current week (highest priority)
      this.ensureCachedWeek(userId, 0, 'high'),
      
      // Previous week (medium priority)
      this.ensureCachedWeek(userId, -1, 'medium'),
      
      // User preferences
      this.cacheUserPreferences(userId),
      
      // Nutrition targets
      this.cacheNutritionTargets(userId)
    ];

    await Promise.allSettled(warmingTasks);
  }

  private static async ensureCachedWeek(
    userId: string, 
    weekOffset: number, 
    priority: 'high' | 'medium' | 'low'
  ): Promise<void> {
    const weekStart = this.calculateWeekStart(new Date(), weekOffset);
    const cached = await MealPlanStorageManager.getCachedWeeklyPlan(weekStart);
    
    if (!cached) {
      // Try to fetch from server
      try {
        const plan = await MealPlanAPI.getMealPlan(userId, weekStart);
        if (plan) {
          await MealPlanStorageManager.cacheWeeklyPlan(weekStart, plan, priority);
        }
      } catch (error) {
        console.warn(`Failed to warm cache for week ${weekStart}:`, error);
      }
    }
  }
}
```

## 📱 UI Components for Sync States

### 1. Sync Status Indicator
```typescript
// src/features/meal-plan/components/SyncStatusIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { useNetworkSync } from '../hooks/useNetworkSync';
import { useAuth } from '@/hooks/useAuth';

export const SyncStatusIndicator: React.FC = () => {
  const { user } = useAuth();
  const {
    isOnline,
    isSyncing,
    lastSyncTime,
    pendingOperations,
    syncProgress,
    triggerManualSync
  } = useNetworkSync(user?.id);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: 'wifi-off',
        color: '#dc3545',
        text: 'Offline',
        subtitle: pendingOperations > 0 ? `${pendingOperations} changes pending` : 'Working offline'
      };
    }

    if (isSyncing) {
      return {
        icon: 'refresh-cw',
        color: '#007AFF',
        text: 'Syncing...',
        subtitle: `${Math.round(syncProgress)}% complete`
      };
    }

    if (pendingOperations > 0) {
      return {
        icon: 'upload',
        color: '#ffc107',
        text: 'Sync Pending',
        subtitle: `${pendingOperations} changes to sync`
      };
    }

    return {
      icon: 'check-circle',
      color: '#28a745',
      text: 'Up to date',
      subtitle: lastSyncTime ? `Last sync: ${formatLastSync(lastSyncTime)}` : 'Never synced'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={isOnline && !isSyncing ? triggerManualSync : undefined}
      disabled={!isOnline || isSyncing}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={statusInfo.icon}
          size={16}
          color={statusInfo.color}
          style={isSyncing ? styles.spinning : undefined}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
        <Text style={styles.subtitleText}>
          {statusInfo.subtitle}
        </Text>
      </View>

      {isSyncing && (
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${syncProgress}%` }
            ]} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const formatLastSync = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 8,
  },
  spinning: {
    // Add rotation animation
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 10,
    color: '#6c757d',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e9ecef',
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 1,
  },
});
```

This comprehensive offline and sync strategy ensures that users can access their meal plans even without internet connectivity, with robust synchronization when the connection is restored.
