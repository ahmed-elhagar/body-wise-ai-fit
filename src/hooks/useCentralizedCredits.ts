
import { useState } from 'react';

export const useCentralizedCredits = () => {
  const [credits, setCredits] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const consumeCredits = async (amount: number) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  return {
    credits,
    isLoading,
    consumeCredits
  };
};
