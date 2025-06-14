
export const useEnhancedErrorSystem = () => {
  const handleError = (error: any, context?: any) => {
    console.error('Error:', error, 'Context:', context);
  };

  return {
    handleError
  };
};
