
import { useState } from 'react';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  return {
    isAdmin,
    adminData
  };
};
