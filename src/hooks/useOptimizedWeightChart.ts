
import { useState } from 'react';

export const useOptimizedWeightChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    chartData,
    isLoading
  };
};
