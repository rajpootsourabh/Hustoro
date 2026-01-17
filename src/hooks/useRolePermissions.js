// hooks/useRolePermissions.js
import { useState, useEffect } from 'react';

export function useRolePermissions() {
  const [userRole, setUserRole] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = () => {
      try {
        const userData = localStorage.getItem('user');
        const isManagerData = localStorage.getItem('isManager');
        
        if (!userData) {
          setUserRole(null);
          setIsManager(false);
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        setUserRole(user.role);
        
        // Parse isManager from localStorage
        let managerStatus = false;
        if (isManagerData !== null) {
          try {
            managerStatus = JSON.parse(isManagerData);
          } catch (e) {
            managerStatus = isManagerData === 'true';
          }
        }
        setIsManager(managerStatus);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to check permissions:", error);
        setUserRole(null);
        setIsManager(false);
        setIsLoading(false);
      }
    };

    checkPermissions();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkPermissions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper functions
  const isAdmin = () => userRole === 1;
  const isEmployee = () => userRole === 5;
  const isCandidate = () => userRole === 6;
  const isManagerRole = () => isEmployee() && isManager;
  const canManageJobs = () => isEmployee(); // Admin and employees can manage jobs
  const canManageShifts = () => isEmployee(); // Admin and employees can manage shifts
  const canTrackTime = () => isCandidate(); // Only candidates can track time
  const canCreateJobs = () => isEmployee(); // Admin and employees can create jobs
  const canEditJobs = () =>  isEmployee(); // Admin and employees can edit jobs
  const canDeleteJobs = () => isEmployee(); // Admin and employees can delete jobs
  const canViewJobs = () => true; // Everyone can view jobs
  const canViewTimeLogs = () => true; // Everyone can view time logs

  return {
    userRole,
    isManager,
    isLoading,
    isAdmin,
    isEmployee,
    isCandidate,
    isManagerRole,
    canManageJobs,
    canManageShifts,
    canTrackTime,
    canCreateJobs,
    canEditJobs,
    canDeleteJobs,
    canViewJobs,
    canViewTimeLogs
  };
}