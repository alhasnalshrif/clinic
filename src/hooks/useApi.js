import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * Custom hook for API calls with loading, error handling, and success messaging
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiCall, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(...args);
      const result = response?.data || response;
      
      setData(result);
      
      if (options.successMessage) {
        message.success(options.successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      
      if (options.showErrorMessage !== false) {
        message.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options.successMessage, options.showErrorMessage]);

  const reset = useCallback(() => {
    setData(options.initialData || null);
    setError(null);
    setLoading(false);
  }, [options.initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

/**
 * Custom hook for paginated API calls
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - Pagination controls and data
 */
export const usePaginatedApi = (apiCall, options = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: options.pageSize || 10,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page = 1, pageSize = pagination.pageSize, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall({
        page,
        pageSize,
        ...filters
      });
      
      const { data: items, total } = response.data || response;
      
      setData(items || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: total || (items?.length || 0)
      }));
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ في تحميل البيانات';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, pagination.pageSize]);

  const refresh = useCallback(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [fetchData, pagination.current, pagination.pageSize]);

  return {
    data,
    pagination,
    loading,
    error,
    fetchData,
    refresh
  };
};

/**
 * Custom hook for form validation and submission
 * @param {Function} onSubmit - Form submission handler
 * @param {Object} validationRules - Validation rules
 * @returns {Object} - Form controls and validation
 */
export const useForm = (onSubmit, validationRules = {}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rules.required.message || `${field} مطلوب`;
        return;
      }
      
      if (value && rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.pattern.message || `${field} غير صحيح`;
        return;
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `يجب أن يكون ${field} ${rules.minLength} أحرف على الأقل`;
        return;
      }
      
      if (value && rules.maxLength && value.length > rules.maxLength) {
        newErrors[field] = `يجب أن يكون ${field} ${rules.maxLength} حرف كحد أقصى`;
        return;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, onSubmit, values]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouched: setFieldTouched,
    handleSubmit,
    reset,
    validate
  };
};