
import { useState } from 'react';

export const useCentralizedCredits = () => {
  const [credits, setCredits] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const consumeCredits = async (amount: number) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  return {
    credits,
    remaining: credits,
    isPro: false,
    hasCredits: credits > 0,
    isLoading,
    consumeCredits
  };
};
