// Accessibility utilities and constants

export const ARIA_LABELS = {
  // Navigation
  MAIN_NAVIGATION: 'التنقل الرئيسي',
  BREADCRUMB: 'مسار التنقل',
  PAGINATION: 'التنقل بين الصفحات',
  
  // Buttons
  CLOSE_BUTTON: 'إغلاق',
  EDIT_BUTTON: 'تعديل',
  DELETE_BUTTON: 'حذف',
  SAVE_BUTTON: 'حفظ',
  CANCEL_BUTTON: 'إلغاء',
  ADD_BUTTON: 'إضافة',
  SEARCH_BUTTON: 'بحث',
  FILTER_BUTTON: 'تصفية',
  PRINT_BUTTON: 'طباعة',
  EXPORT_BUTTON: 'تصدير',
  
  // Forms
  REQUIRED_FIELD: 'حقل مطلوب',
  SEARCH_INPUT: 'مربع البحث',
  FILTER_SELECT: 'قائمة التصفية',
  DATE_PICKER: 'اختيار التاريخ',
  TIME_PICKER: 'اختيار الوقت',
  
  // Status
  LOADING: 'جاري التحميل...',
  ERROR: 'خطأ',
  SUCCESS: 'نجح',
  WARNING: 'تحذير',
  
  // Tables
  SORT_ASCENDING: 'ترتيب تصاعدي',
  SORT_DESCENDING: 'ترتيب تنازلي',
  ROW_ACTIONS: 'إجراءات الصف',
  
  // Modal
  MODAL_CLOSE: 'إغلاق النافذة المنبثقة',
  MODAL_CONFIRM: 'تأكيد',
  
  // Menu
  USER_MENU: 'قائمة المستخدم',
  MAIN_MENU: 'القائمة الرئيسية',
};

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * Creates accessible button props
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @param {Object} options - Additional options
 * @returns {Object} - Button props with accessibility
 */
export const createAccessibleButtonProps = (label, onClick, options = {}) => {
  return {
    'aria-label': label,
    onClick,
    onKeyDown: (e) => {
      if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
        e.preventDefault();
        onClick(e);
      }
      options.onKeyDown?.(e);
    },
    role: 'button',
    tabIndex: 0,
    ...options,
  };
};

/**
 * Creates accessible link props
 * @param {string} label - Link label
 * @param {string} href - Link href
 * @param {Object} options - Additional options
 * @returns {Object} - Link props with accessibility
 */
export const createAccessibleLinkProps = (label, href, options = {}) => {
  return {
    'aria-label': label,
    href,
    role: 'link',
    tabIndex: 0,
    ...options,
  };
};

/**
 * Creates accessible form field props
 * @param {string} id - Field id
 * @param {string} label - Field label
 * @param {boolean} required - Whether field is required
 * @param {string} description - Field description
 * @returns {Object} - Form field props with accessibility
 */
export const createAccessibleFormFieldProps = (id, label, required = false, description = '') => {
  const props = {
    id,
    'aria-label': label,
    'aria-required': required,
  };

  if (description) {
    props['aria-describedby'] = `${id}-description`;
  }

  if (required) {
    props['aria-label'] = `${label} ${ARIA_LABELS.REQUIRED_FIELD}`;
  }

  return props;
};

/**
 * Creates accessible table props
 * @param {string} caption - Table caption
 * @param {Array} headers - Table headers
 * @returns {Object} - Table props with accessibility
 */
export const createAccessibleTableProps = (caption, headers = []) => {
  return {
    role: 'table',
    'aria-label': caption,
    'aria-rowcount': -1, // Dynamic content
    'aria-colcount': headers.length,
  };
};

/**
 * Creates accessible modal props
 * @param {string} title - Modal title
 * @param {string} describedBy - Element that describes the modal
 * @returns {Object} - Modal props with accessibility
 */
export const createAccessibleModalProps = (title, describedBy = '') => {
  const props = {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': 'modal-title',
  };

  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }

  return props;
};

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Set focus to element with delay
   * @param {string|Element} element - Element selector or element
   * @param {number} delay - Delay in ms
   */
  focusElement: (element, delay = 0) => {
    setTimeout(() => {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      if (el && typeof el.focus === 'function') {
        el.focus();
      }
    }, delay);
  },

  /**
   * Focus first focusable element in container
   * @param {Element} container - Container element
   */
  focusFirstElement: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  /**
   * Focus last focusable element in container
   * @param {Element} container - Container element
   */
  focusLastElement: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  },

  /**
   * Trap focus within element
   * @param {Element} element - Element to trap focus in
   * @returns {Function} - Cleanup function
   */
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === KEYBOARD_KEYS.TAB) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },
};

/**
 * Screen reader utilities
 */
export const screenReaderUtils = {
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level (polite, assertive)
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.setAttribute('class', 'sr-only');
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Update screen reader text for dynamic content
   * @param {string} elementId - Element ID
   * @param {string} text - New text
   */
  updateText: (elementId, text) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  },
};

/**
 * Color contrast utilities
 */
export const colorUtils = {
  /**
   * Check if color combination meets WCAG contrast ratio
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @param {string} level - WCAG level (AA, AAA)
   * @returns {boolean} - Whether contrast is sufficient
   */
  checkContrast: (foreground, background, level = 'AA') => {
    // This is a simplified version - in production, use a proper contrast checking library
    const contrastRatios = {
      AA: 4.5,
      AAA: 7,
    };
    
    // Simplified contrast calculation (use proper library in production)
    return true; // Placeholder
  },

  /**
   * Get accessible color based on background
   * @param {string} background - Background color
   * @returns {string} - Accessible foreground color
   */
  getAccessibleColor: (background) => {
    // Simplified version - use proper color library in production
    return background === '#ffffff' ? '#000000' : '#ffffff';
  },
};