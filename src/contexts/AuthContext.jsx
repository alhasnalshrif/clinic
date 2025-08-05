import React, { createContext, useContext, useState, useEffect } from 'react';
import { App } from 'antd';
import authApi from '../pages/Auth/api/authApi';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { message } = App.useApp();

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          await getCurrentUser();
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with credentials:', { username: credentials.username });
      const response = await authApi.login(credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.token && response.data.user) {
        const { token: authToken, user: userData } = response.data;
        
        console.log('Login successful, token:', authToken, 'user:', userData);
        
        // Store token in localStorage and state
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        
        message.success('تم تسجيل الدخول بنجاح');
        return true;
      } else {
        console.log('Login response indicates failure');
        message.error('فشل في تسجيل الدخول');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'خطأ في تسجيل الدخول';
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await authApi.logout();
    } catch (error) {
      console.log('Logout API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      message.success('تم تسجيل الخروج بنجاح');
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    getCurrentUser,
  };

  console.log('AuthContext state:', { 
    hasToken: !!token, 
    hasUser: !!user, 
    isAuthenticated: !!token && !!user,
    isLoading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
