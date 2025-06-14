
import { useState } from 'react';

export const useCoachSystem = () => {
  const [trainees, setTrainees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    trainees,
    isLoading
  };
};
