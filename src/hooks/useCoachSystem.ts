
import { useState } from 'react';

export const useCoachSystem = () => {
  const [trainees, setTrainees] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false);
  const [isLoadingCoachInfo, setIsLoadingCoachInfo] = useState(false);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [unreadMessagesByCoach, setUnreadMessagesByCoach] = useState({});
  const [coachInfoError, setCoachInfoError] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const assignTrainee = async (traineeId: string) => {
    setIsAssigning(true);
    try {
      console.log('Assigning trainee:', traineeId);
    } catch (error) {
      console.error('Error assigning trainee:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    trainees,
    coaches,
    isLoading,
    isLoadingTrainees,
    isLoadingCoachInfo,
    totalUnreadMessages,
    unreadMessagesByCoach,
    coachInfoError,
    isCoach,
    assignTrainee,
    isAssigning
  };
};
