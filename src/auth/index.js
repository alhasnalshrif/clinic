// Auth system exports
export { AuthProvider, useAuth } from './AuthContext';
export { ProtectedRoute, PublicRoute, RoleGuard, PermissionGuard } from './ProtectedRoute';
export { 
  useAuthState, 
  useLogin, 
  useLogout, 
  usePermissions, 
  useUserProfile, 
  useToken 
} from './hooks';
export { 
  USER_ROLES, 
  PERMISSIONS, 
  ROLE_PERMISSIONS, 
  getPermissionsForRole, 
  roleHasPermission 
} from './permissions';

// Default export for the main auth provider
export { AuthProvider as default } from './AuthContext';
