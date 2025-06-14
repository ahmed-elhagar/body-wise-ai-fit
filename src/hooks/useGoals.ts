
import { useState } from 'react';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  const getWeightGoal = () => {
    return currentGoal;
  };

  return {
    goals,
    isLoading,
    currentGoal,
    getWeightGoal
  };
};
