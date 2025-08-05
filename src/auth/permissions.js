// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  MANAGER: 'manager',
};

// Permissions
export const PERMISSIONS = {
  // Patient management
  VIEW_PATIENTS: 'view_patients',
  CREATE_PATIENTS: 'create_patients',
  UPDATE_PATIENTS: 'update_patients',
  DELETE_PATIENTS: 'delete_patients',
  
  // Appointments
  VIEW_APPOINTMENTS: 'view_appointments',
  CREATE_APPOINTMENTS: 'create_appointments',
  UPDATE_APPOINTMENTS: 'update_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',
  
  // Medical records
  VIEW_MEDICAL_RECORDS: 'view_medical_records',
  CREATE_MEDICAL_RECORDS: 'create_medical_records',
  UPDATE_MEDICAL_RECORDS: 'update_medical_records',
  DELETE_MEDICAL_RECORDS: 'delete_medical_records',
  
  // Treatments
  VIEW_TREATMENTS: 'view_treatments',
  CREATE_TREATMENTS: 'create_treatments',
  UPDATE_TREATMENTS: 'update_treatments',
  DELETE_TREATMENTS: 'delete_treatments',
  
  // Payments
  VIEW_PAYMENTS: 'view_payments',
  CREATE_PAYMENTS: 'create_payments',
  UPDATE_PAYMENTS: 'update_payments',
  DELETE_PAYMENTS: 'delete_payments',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  
  // User management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  
  // System settings
  VIEW_SETTINGS: 'view_settings',
  UPDATE_SETTINGS: 'update_settings',
  
  // SMS
  SEND_SMS: 'send_sms',
  VIEW_SMS_LOGS: 'view_sms_logs',
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  
  [USER_ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.UPDATE_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.UPDATE_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.CREATE_MEDICAL_RECORDS,
    PERMISSIONS.UPDATE_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_TREATMENTS,
    PERMISSIONS.CREATE_TREATMENTS,
    PERMISSIONS.UPDATE_TREATMENTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  
  [USER_ROLES.NURSE]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.UPDATE_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.UPDATE_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.UPDATE_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_TREATMENTS,
  ],
  
  [USER_ROLES.RECEPTIONIST]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.UPDATE_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.UPDATE_APPOINTMENTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.CREATE_PAYMENTS,
    PERMISSIONS.SEND_SMS,
  ],
  
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_TREATMENTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_SMS_LOGS,
  ],
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Helper function to check if role has permission
export const roleHasPermission = (role, permission) => {
  const rolePermissions = getPermissionsForRole(role);
  return rolePermissions.includes(permission);
};
