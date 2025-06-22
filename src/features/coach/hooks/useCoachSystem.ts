
import { useRole } from '@/shared/hooks/useRole';
import { useCoachInfo } from '@/features/coach/hooks/useCoachInfo';
import { useTrainees } from '@/features/coach/hooks/useTrainees';
import { useCoachMutations } from '@/features/coach/hooks/useCoachMutations';

export * from '@/features/coach/types/coach.types';

export const useCoachSystem = () => {
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  
  // Get coach info (for trainees) - now returns multiple coaches
  const { 
    data: multipleCoachesInfo, 
    isLoading: isLoadingCoachInfo, 
    error: coachInfoError, 
    refetch: refetchCoachInfo 
  } = useCoachInfo();
  
  // Get trainees (for coaches)
  const { 
    data: trainees = [], 
    isLoading: isLoadingTrainees, 
    error: traineesError, 
    refetch: refetchTrainees 
  } = useTrainees();
  
  // Get mutations
  const {
    assignTrainee,
    removeTrainee,
    updateTraineeNotes,
    isAssigning,
    isRemoving,
    isUpdatingNotes,
  } = useCoachMutations();

  const isCoach = isRoleCoach || isAdmin || trainees.length > 0;

  return {
    // Multiple coaches info (for trainees)
    multipleCoachesInfo,
    coaches: multipleCoachesInfo?.coaches || [],
    totalUnreadMessages: multipleCoachesInfo?.totalUnreadMessages || 0,
    unreadMessagesByCoach: multipleCoachesInfo?.unreadMessagesByCoach || {},
    isLoadingCoachInfo,
    coachInfoError,
    refetchCoachInfo,
    
    // Legacy single coach support (returns first coach for backward compatibility)
    coachInfo: multipleCoachesInfo?.coaches?.[0] || null,
    
    // Trainees (for coaches)
    trainees,
    isLoadingTrainees,
    traineesError,
    refetchTrainees,
    
    // Mutations
    assignTrainee,
    removeTrainee,
    updateTraineeNotes,
    
    // Loading states
    isAssigning,
    isRemoving,
    isUpdatingNotes,
    
    // Status
    isCoach,
    error: coachInfoError || traineesError,
  };
};
