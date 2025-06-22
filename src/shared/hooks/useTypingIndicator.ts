
export const useTypingIndicator = (coachId: string, traineeId: string) => {
  return {
    typingUsers: [],
    sendTypingIndicator: () => {},
    stopTypingIndicator: () => {},
    isTyping: false,
    startTyping: () => {},
    stopTyping: () => {}
  };
};
