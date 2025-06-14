
export const getAuthHelpers = () => {
  return {
    validateSession: () => true,
    refreshToken: () => Promise.resolve(),
    clearAuthData: () => {}
  };
};

export const clearLocalAuthData = () => {
  localStorage.removeItem('auth_data');
  console.log('Local auth data cleared');
};
