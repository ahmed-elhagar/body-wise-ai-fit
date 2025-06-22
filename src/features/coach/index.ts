// Coach Feature - Central exports for coach functionality
// This feature handles all coach-related components, hooks, and services

// Core Dashboard Components
export { default as CoachDashboard } from './components/CoachDashboard';
export { default as EnhancedCoachDashboard } from './components/EnhancedCoachDashboard';
export { default as CoachStatsCards } from './components/CoachStatsCards';
export { default as CoachTabs } from './components/CoachTabs';
export { default as CoachHeader } from './components/CoachHeader';

// Trainee Management Components
export { default as TraineesTab } from './components/TraineesTab';
export { default as EnhancedTraineesTab } from './components/EnhancedTraineesTab';
export { default as TraineeCard } from './components/TraineeCard';
export { default as TraineeDetailsDialog } from './components/TraineeDetailsDialog';
export { default as TraineeFilterBar } from './components/TraineeFilterBar';
export { default as TraineeProgressCard } from './components/TraineeProgressCard';
export { default as TraineeProgressView } from './components/TraineeProgressView';
export { default as TraineeProgressTracking } from './components/TraineeProgressTracking';
export { default as AssignTraineeDialog } from './components/AssignTraineeDialog';
export { default as UserSearchDropdown } from './components/UserSearchDropdown';

// Messaging Components
export { default as CoachMessagesTab } from './components/CoachMessagesTab';
export { default as CoachMessagingCenter } from './components/CoachMessagingCenter';
export { default as MultipleCoachesChat } from './components/MultipleCoachesChat';
export { default as CoachTraineeChat } from './components/CoachTraineeChat';
export { default as TraineeCoachChat } from './components/TraineeCoachChat';

// Analytics Components
export { default as CoachAnalyticsTab } from './components/CoachAnalyticsTab';
export { default as CoachAnalyticsDashboard } from './components/CoachAnalyticsDashboard';
export { default as CoachMetricsOverview } from './components/CoachMetricsOverview';

// Task Management Components
export { default as CoachTasksPanel } from './components/CoachTasksPanel';
export { default as CreateTaskDialog } from './components/CreateTaskDialog';
export { default as UpdateNotesDialog } from './components/UpdateNotesDialog';

// Other Components
export { default as CoachesTab } from './components/CoachesTab';

// Chat Components
export { default as ChatHeader } from './components/chat/ChatHeader';
export { default as ChatInput } from './components/chat/ChatInput';
export { default as MessagesList } from './components/chat/MessagesList';

// Overview Components
export { default as QuickActions } from './components/overview/QuickActions';
export { default as CompactTasksPanel } from './components/overview/CompactTasksPanel';
export { default as TraineeProgressOverview } from './components/overview/TraineeProgressOverview';

// Hooks Exports
export { default as useCoach } from './hooks/useCoach';
export { default as useCoachChat } from './hooks/useCoachChat';
export { default as useCoachSystem } from './hooks/useCoachSystem';
export { default as useCoachTasks } from './hooks/useCoachTasks';
export { default as useCoachInfo } from './hooks/useCoachInfo';
export { default as useCoachMutations } from './hooks/useCoachMutations';
export { default as useTrainees } from './hooks/useTrainees';

// Types Exports
export type { 
  CoachInfo, 
  TraineeInfo, 
  CoachMessage, 
  CoachTask,
  CoachAnalytics,
  CoachStats,
  ChatThread,
  TraineeProgress,
  CreateTaskForm,
  UpdateTaskForm,
  AssignTraineeForm,
  SendMessageForm,
  TraineeFilters,
  TaskFilters,
  CoachApiResponse,
  CoachNotification
} from './types/coach.types';

// Services Exports
export { default as coachApi } from './services/coachApi';

// Feature Configuration
export const COACH_FEATURE_CONFIG = {
  name: 'coach',
  version: '1.0.0',
  description: 'Coach management and trainee interaction system',
  routes: [
    '/coach',
    '/coach/dashboard', 
    '/coach/trainees',
    '/coach/messages',
    '/coach/analytics'
  ],
  components: {
    total: 26,
    migrated: 26, // ✅ ALL MIGRATED!
    pending: 0
  },
  hooks: {
    total: 7,
    migrated: 7, // ✅ ALL MIGRATED!
    pending: 0
  },
  services: {
    total: 1,
    migrated: 1, // ✅ API SERVICE CREATED!
    pending: 0
  }
} as const; 