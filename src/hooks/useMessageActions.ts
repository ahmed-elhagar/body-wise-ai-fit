
import { useState } from 'react';

export const useMessageActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading
  };
};
