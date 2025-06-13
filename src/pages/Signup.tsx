
import React from 'react';
import { Navigate } from 'react-router-dom';

const UnifiedSignup = () => {
  // Redirect to auth page since we handle both login and signup there
  return <Navigate to="/auth" replace />;
};

export default UnifiedSignup;
