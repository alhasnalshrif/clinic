import moment from 'moment';

// Date and time utilities
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatTime = (date, format = 'h:mm A') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const formatDateTime = (date, format = 'DD/MM/YYYY h:mm A') => {
  if (!date) return '';
  return moment(date).format(format);
};

export const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

export const isPast = (date) => {
  return moment(date).isBefore(moment());
};

export const isFuture = (date) => {
  return moment(date).isAfter(moment());
};

// Currency and number utilities
export const formatCurrency = (amount, currency = 'ر.س') => {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted} ${currency}`;
};

export const formatNumber = (number) => {
  if (isNaN(number) || number === null || number === undefined) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

// Local storage utilities
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Array utilities
export const sortByDate = (array, dateField = 'date', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = moment(a[dateField]);
    const dateB = moment(b[dateField]);
    return order === 'desc' ? dateB.diff(dateA) : dateA.diff(dateB);
  });
};

export const groupByDate = (array, dateField = 'date') => {
  return array.reduce((groups, item) => {
    const date = moment(item[dateField]).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};

// File utilities
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Status utilities
export const getStatusConfig = (status) => {
  const statusConfigs = {
    confirmed: {
      color: 'success',
      text: 'مؤكد',
      className: 'status-confirmed'
    },
    pending: {
      color: 'processing',
      text: 'في الانتظار',
      className: 'status-pending'
    },
    cancelled: {
      color: 'error',
      text: 'ملغي',
      className: 'status-cancelled'
    },
    completed: {
      color: 'success',
      text: 'مكتمل',
      className: 'status-completed'
    }
  };
  
  return statusConfigs[status] || statusConfigs.pending;
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};