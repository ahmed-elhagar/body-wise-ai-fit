
import { useState } from 'react';

export const useTypingIndicator = (coachId: string, traineeId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const sendTypingIndicator = () => {
    console.log('Typing indicator sent');
  };

  const stopTypingIndicator = () => {
    console.log('Typing indicator stopped');
  };

  return {
    typingUsers,
    sendTypingIndicator,
    stopTypingIndicator
  };
};
