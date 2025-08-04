// Application configuration and settings

// Check if running in Electron environment
const isElectron = window.electronAPI?.isElectron || false;

// Get server URL from Electron or use default
let serverUrl = 'http://localhost:8000';

if (isElectron && window.electronAPI) {
  // Will be set asynchronously
  window.electronAPI.getServerUrl().then(url => {
    serverUrl = url;
    // Update API configuration
    APP_CONFIG.API.BASE_URL = url;
  });
} else {
  serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
}

export const APP_CONFIG = {
  // Application Information
  APP_NAME: 'نظام إدارة العيادة السنية',
  APP_VERSION: '2.0.0',
  APP_DESCRIPTION: 'نظام شامل لإدارة العيادات السنية',
  
  // Environment Information
  IS_ELECTRON: isElectron,
  IS_DESKTOP_APP: isElectron,
  
  // API Configuration
  API: {
    BASE_URL: serverUrl,
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  // UI Configuration
  UI: {
    THEME: {
      PRIMARY_COLOR: '#0D7377',
      SECONDARY_COLOR: '#14A085',
      DIRECTION: 'rtl',
      LOCALE: 'ar',
    },
    LAYOUT: {
      SIDEBAR_WIDTH: 275,
      HEADER_HEIGHT: 64,
      COLLAPSED_SIDEBAR_WIDTH: 80,
    },
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
      SHOW_SIZE_CHANGER: true,
      SHOW_QUICK_JUMPER: true,
    },
    TABLE: {
      DEFAULT_SCROLL: { x: 800 },
      DEFAULT_SIZE: 'middle',
    },
  },
  
  // Features Configuration
  FEATURES: {
    LAZY_LOADING: true,
    ERROR_BOUNDARY: true,
    OFFLINE_SUPPORT: false,
    REAL_TIME_UPDATES: false,
    ANALYTICS: false,
    DARK_MODE: true,
    PRINT_SUPPORT: true,
    EXPORT_SUPPORT: true,
    SERVER_CONFIG: isElectron, // Enable server configuration in desktop app
  },
  
  // Security Configuration
  SECURITY: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_2FA: false,
    AUTO_LOGOUT_WARNING: 5 * 60 * 1000, // 5 minutes before logout
  },
  
  // File Upload Configuration
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    UPLOAD_ENDPOINT: '/api/upload',
  },
  
  // Notification Configuration
  NOTIFICATIONS: {
    POSITION: 'topLeft',
    DURATION: 4.5,
    MAX_COUNT: 3,
    ENABLE_SOUND: false,
  },
  
  // Search Configuration
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
    MAX_RESULTS: 50,
  },
  
  // Date and Time Configuration
  DATE_TIME: {
    DEFAULT_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    TIMEZONE: 'Asia/Riyadh',
    FIRST_DAY_OF_WEEK: 6, // Saturday
  },
  
  // Validation Configuration
  VALIDATION: {
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
  
  // Cache Configuration
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    MAX_ITEMS: 100,
    STORAGE_KEY_PREFIX: 'clinic_cache_',
  },
  
  // Development Configuration
  DEVELOPMENT: {
    DEBUG: process.env.NODE_ENV === 'development',
    MOCK_API: false,
    SHOW_REDUX_DEVTOOLS: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  },
  
  // Performance Configuration
  PERFORMANCE: {
    LAZY_LOAD_OFFSET: 100,
    VIRTUAL_SCROLL_THRESHOLD: 100,
    IMAGE_LAZY_LOADING: true,
    COMPONENT_MEMOIZATION: true,
  },
  
  // Accessibility Configuration
  ACCESSIBILITY: {
    KEYBOARD_NAVIGATION: true,
    SCREEN_READER_SUPPORT: true,
    HIGH_CONTRAST_MODE: true,
    FOCUS_INDICATORS: true,
    ARIA_LABELS: true,
  },
  
  // Backup and Sync Configuration
  BACKUP: {
    AUTO_SAVE_INTERVAL: 2 * 60 * 1000, // 2 minutes
    LOCAL_STORAGE_BACKUP: true,
    SYNC_ON_CONNECT: true,
  },
};

// Function to update server URL (for desktop app)
export const updateServerUrl = async (newUrl) => {
  if (isElectron && window.electronAPI) {
    await window.electronAPI.setServerUrl(newUrl);
    APP_CONFIG.API.BASE_URL = newUrl;
    return true;
  }
  return false;
};

// Function to test server connection
export const testServerConnection = async (url) => {
  if (isElectron && window.electronAPI) {
    return await window.electronAPI.testServerConnection(url);
  }
  
  try {
    const response = await fetch(url + '/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  APP_CONFIG.DEVELOPMENT.DEBUG = false;
  APP_CONFIG.DEVELOPMENT.SHOW_REDUX_DEVTOOLS = false;
  APP_CONFIG.DEVELOPMENT.LOG_LEVEL = 'error';
  APP_CONFIG.FEATURES.ANALYTICS = true;
}

if (process.env.NODE_ENV === 'test') {
  APP_CONFIG.API.TIMEOUT = 5000;
  APP_CONFIG.DEVELOPMENT.MOCK_API = true;
  APP_CONFIG.NOTIFICATIONS.DURATION = 1;
}

// Feature flags for gradual rollout
export const FEATURE_FLAGS = {
  NEW_DASHBOARD: true,
  ADVANCED_SEARCH: true,
  REAL_TIME_CHAT: false,
  AI_DIAGNOSIS_ASSISTANT: false,
  MOBILE_APP_SYNC: false,
  VOICE_COMMANDS: false,
  BIOMETRIC_AUTH: false,
  TELEMEDICINE: false,
  SERVER_CONFIGURATION: isElectron, // Desktop app specific feature
};

// Application constants that don't change
export const APP_CONSTANTS = {
  ROUTES: {
    HOME: '/',
    DASHBOARD: '/',
    APPOINTMENTS: '/appointments',
    PATIENTS: '/dentalrecords',
    TREATMENTS: '/treatments',
    MEDICAL_HISTORY: '/medical-history',
    REPORTS: '/reports',
    PAYMENTS: '/transactionlog',
    SMS: '/sms',
    USERS: '/useraccounts',
    SETTINGS: '/settings',
    RECEPTION: '/home',
    SERVER_CONFIG: '/server-config', // New route for server configuration
  },
  
  STORAGE_KEYS: {
    USER: 'clinic_user',
    TOKEN: 'clinic_token',
    THEME: 'clinic_theme',
    LANGUAGE: 'clinic_language',
    PREFERENCES: 'clinic_preferences',
    SERVER_URL: 'clinic_server_url', // For web version
  },
  
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
  
  USER_ROLES: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    ASSISTANT: 'assistant',
    RECEPTIONIST: 'receptionist',
  },
};

export default APP_CONFIG;