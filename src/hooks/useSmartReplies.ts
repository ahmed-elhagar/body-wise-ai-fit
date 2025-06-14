
import { useState } from 'react';

export const useSmartReplies = () => {
  const [suggestions, setSuggestions] = useState([]);

  return {
    suggestions
  };
};
