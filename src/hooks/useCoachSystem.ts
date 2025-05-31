
import { useRole } from './useRole';
import { useCoachInfo } from './coach/useCoachInfo';
import { useTrainees } from './coach/useTrainees';
import { useCoachMutations } from './coach/useCoachMutations';

export * from './coach/types';

export const useCoachSystem = () => {
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  
  // Get coach info (for trainees)
  const { 
    data: coachInfo, 
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
    // Coach info (for trainees)
    coachInfo,
    isLoadingCoachInfo,
    coachInfoError,
    refetchCoachInfo,
    
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
