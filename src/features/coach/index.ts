
// Coach Feature Exports
export * from './components';

// Main components
export { default as CoachPage } from './components/CoachPage';
export { default as CoachDashboard } from './components/CoachDashboard';
export { default as CoachTasksPanel } from './components/CoachTasksPanel';
export { default as TraineesTab } from './components/TraineesTab';
export { default as CoachMessagesTab } from './components/CoachMessagesTab';
export { default as AssignTraineeDialog } from './components/AssignTraineeDialog';
export { default as CreateTaskDialog } from './components/CreateTaskDialog';
export { default as TraineeCard } from './components/TraineeCard';
export { default as TraineeDetailsDialog } from './components/TraineeDetailsDialog';

// Hooks
export { useCoachSystem } from './hooks/useCoachSystem';
export { useCoachTasks } from './hooks/useCoachTasks';
export { useCoach } from './hooks/useCoach';
export { useCoachChat } from './hooks/useCoachChat';
export { useCoachInfo } from './hooks/useCoachInfo';
export { useCoachMutations } from './hooks/useCoachMutations';
export { useTrainees } from './hooks/useTrainees';

// Types
export type * from './types/coach.types';
