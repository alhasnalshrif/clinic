// Application constants

export const API_ENDPOINTS = {
  DASHBOARD: '/dashboard/incomereceivable',
  APPOINTMENTS: '/appointments',
  PATIENTS: '/patients',
  TREATMENTS: '/treatments',
  MEDICAL_HISTORY: '/medical-history',
  REPORTS: '/reports',
  USERS: '/users',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  }
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show'
};

export const TREATMENT_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  ASSISTANT: 'assistant',
  RECEPTIONIST: 'receptionist'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const DENTAL_PROCEDURES = [
  { value: 'consultation', label: 'استشارة', category: 'general' },
  { value: 'cleaning', label: 'تنظيف الأسنان', category: 'preventive' },
  { value: 'filling', label: 'حشو الأسنان', category: 'restorative' },
  { value: 'extraction', label: 'خلع الأسنان', category: 'surgical' },
  { value: 'root_canal', label: 'علاج العصب', category: 'endodontic' },
  { value: 'crown', label: 'تركيب تاج', category: 'prosthetic' },
  { value: 'bridge', label: 'تركيب جسر', category: 'prosthetic' },
  { value: 'implant', label: 'زراعة الأسنان', category: 'surgical' },
  { value: 'orthodontics', label: 'تقويم الأسنان', category: 'orthodontic' },
  { value: 'whitening', label: 'تبييض الأسنان', category: 'cosmetic' },
  { value: 'veneers', label: 'قشرة الأسنان', category: 'cosmetic' },
  { value: 'dentures', label: 'طقم أسنان', category: 'prosthetic' }
];

export const MEDICAL_CONDITIONS = [
  'السكري',
  'ارتفاع ضغط الدم',
  'أمراض القلب',
  'الربو',
  'الحساسية',
  'أمراض الكلى',
  'أمراض الكبد',
  'الصرع',
  'اضطرابات النزف',
  'أمراض الغدة الدرقية',
  'التهاب المفاصل',
  'السرطان',
  'فيروس نقص المناعة',
  'التهاب الكبد',
  'أمراض عقلية'
];

export const MEDICATIONS = [
  'الأسبرين',
  'الوارفارين',
  'الكومادين',
  'الأنسولين',
  'أدوية ضغط الدم',
  'أدوية القلب',
  'أدوية السكري',
  'مضادات الاكتئاب',
  'المضادات الحيوية',
  'أدوية الصرع',
  'أدوية الغدة الدرقية',
  'مسكنات الألم',
  'أدوية الحساسية',
  'فيتامينات ومكملات'
];

export const ALLERGIES = [
  'البنسلين',
  'المضادات الحيوية',
  'الأسبرين',
  'اللاتكس',
  'المعادن',
  'المواد الغذائية',
  'مواد التخدير الموضعي',
  'الكوديين',
  'السلفا',
  'الأيبوبروفين',
  'الكورتيزون',
  'مواد التنظيف'
];

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY h:mm A',
  TIME: 'h:mm A',
  API: 'YYYY-MM-DD',
  DATABASE: 'YYYY-MM-DD HH:mm:ss'
};

export const TABLE_PAGE_SIZES = [10, 20, 50, 100];

export const THEME_COLORS = {
  PRIMARY: '#0D7377',
  SECONDARY: '#14A085',
  ACCENT: '#329D9C',
  LIGHT_ACCENT: '#7DE7EB',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  TEXT_PRIMARY: '#1f2937',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND_LIGHT: '#f8fafc'
};

export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: 'هذا الحقل مطلوب' },
  EMAIL: {
    type: 'email',
    message: 'يرجى إدخال بريد إلكتروني صحيح'
  },
  PHONE: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'يرجى إدخال رقم هاتف صحيح'
  },
  MIN_LENGTH: (min) => ({
    min: min,
    message: `يجب أن يكون الحد الأدنى ${min} أحرف`
  }),
  MAX_LENGTH: (max) => ({
    max: max,
    message: `يجب أن يكون الحد الأقصى ${max} حرف`
  })
};

export const DRAWER_WIDTH = 275;
export const HEADER_HEIGHT = 64;
export const API_TIMEOUT = 10000;
export const DEBOUNCE_DELAY = 300;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'clinic_token',
  USER: 'clinic_user',
  THEME: 'clinic_theme',
  LANGUAGE: 'clinic_language',
  SIDEBAR_COLLAPSED: 'clinic_sidebar_collapsed'
};