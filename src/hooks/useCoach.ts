
import { useState } from 'react';

export const useCoach = () => {
  const [isCoach, setIsCoach] = useState(false);
  const [coachData, setCoachData] = useState(null);

  return {
    isCoach,
    coachData
  };
};
