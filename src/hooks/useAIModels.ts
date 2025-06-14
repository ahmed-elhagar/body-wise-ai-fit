
import { useState, useEffect } from 'react';

export const useAIModels = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock AI models data
    setTimeout(() => {
      setModels([
        { id: 'gpt-4', name: 'GPT-4', status: 'active' },
        { id: 'claude-3', name: 'Claude 3', status: 'active' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    models,
    isLoading
  };
};
