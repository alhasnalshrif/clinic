import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spin } from 'antd';

// Protected Route Component
export const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (only accessible when not authenticated)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role Guard Component
export const RoleGuard = ({ children, allowedRoles = [], fallback = null }) => {
  const { user, hasRole } = useAuth();

  const hasAllowedRole = allowedRoles.some(role => hasRole(role));

  if (!hasAllowedRole) {
    return fallback || <div>ليس لديك صلاحية للوصول إلى هذا المحتوى</div>;
  }

  return children;
};

// Permission Guard Component
export const PermissionGuard = ({ children, requiredPermissions = [], fallback = null }) => {
  const { hasPermission } = useAuth();

  const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));

  if (!hasAllPermissions) {
    return fallback || <div>ليس لديك صلاحية للوصول إلى هذا المحتوى</div>;
  }

  return children;
};
