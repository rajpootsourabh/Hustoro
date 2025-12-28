import { useState, useEffect } from 'react';

export function useRoleEnabled(requiredRole, requireManager = false) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = () => {
      try {
        const userData = localStorage.getItem('user');
        const isManagerData = localStorage.getItem('isManager');
        
        if (!userData) {
          setIsEnabled(false);
          setIsManager(false);
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        
        // Parse isManager from localStorage
        let managerStatus = false;
        if (isManagerData !== null) {
          try {
            managerStatus = JSON.parse(isManagerData);
          } catch (e) {
            // If parsing fails, check string value
            managerStatus = isManagerData === 'true';
          }
        }
        
        setIsManager(managerStatus);
        
        // Check if user has the required role
        const hasRequiredRole = user.role === requiredRole;
        
        // If requireManager is true, user must be manager AND have the required role
        if (requireManager) {
          setIsEnabled(hasRequiredRole && managerStatus);
        } else {
          setIsEnabled(hasRequiredRole);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to check permissions:", error);
        setIsEnabled(false);
        setIsManager(false);
        setIsLoading(false);
      }
    };

    checkPermissions();
    
    // Optional: Listen for storage changes
    const handleStorageChange = () => {
      checkPermissions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [requiredRole, requireManager]);

  return { isEnabled, isManager, isLoading };
}

// Helper hooks for common scenarios
export function useAdminEnabled() {
  return useRoleEnabled(1); // Role 1 = Admin
}

export function useEmployeeEnabled() {
  return useRoleEnabled(5); // Role 5 = Employee
}

export function useCandidateEnabled() {
  return useRoleEnabled(6); // Role 6 = Candidate
}

export function useManagerEnabled() {
  return useRoleEnabled(5, true); // Role 5 + Manager = true
}