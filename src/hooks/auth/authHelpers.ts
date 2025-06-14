
export const getAuthHelpers = () => {
  return {
    validateSession: () => true,
    refreshToken: () => Promise.resolve(),
    clearAuthData: () => {}
  };
};
