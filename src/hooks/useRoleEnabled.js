import { useState, useEffect } from 'react';

export function useRoleEnabled(requiredRole) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsEnabled(user.role === requiredRole);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        setIsEnabled(false);
      }
    }
  }, [requiredRole]);

  return isEnabled;
}
