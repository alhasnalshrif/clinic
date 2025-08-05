import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Hook for authentication state
export const useAuthState = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    isLoggedIn: isAuthenticated && !!user,
  };
};

// Hook for login functionality
export const useLogin = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials) => {
    setIsSubmitting(true);
    const result = await login(credentials);
    setIsSubmitting(false);
    return result;
  };

  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  return {
    login: handleLogin,
    isSubmitting: isSubmitting || isLoading,
    error,
    clearError,
  };
};

// Hook for logout functionality
export const useLogout = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return {
    logout: handleLogout,
    isLoggingOut,
  };
};

// Hook for permission checking
export const usePermissions = () => {
  const { hasPermission, hasRole, user } = useAuth();

  return {
    hasPermission,
    hasRole,
    userRole: user?.group,
    permissions: user?.permissions || [],
  };
};

// Hook for user profile management
export const useUserProfile = () => {
  const { user, updateUser } = useAuth();

  const updateProfile = (profileData) => {
    updateUser(profileData);
  };

  return {
    user,
    updateProfile,
    isAdmin: user?.group === 'admin',
    isDoctor: user?.group === 'doctor',
    isNurse: user?.group === 'nurse',
    isReceptionist: user?.group === 'receptionist',
    isManager: user?.group === 'manager',
  };
};

// Hook for token management
export const useToken = () => {
  const { token } = useAuth();
  
  const isTokenExpired = () => {
    if (!token) return true;
    
    try {
      // For JWT tokens, check expiration
      if (token.includes('.')) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
      }
      // For other tokens, assume they're valid
      return false;
    } catch {
      return true;
    }
  };

  return {
    token,
    hasToken: !!token,
    isTokenExpired: isTokenExpired(),
  };
};
