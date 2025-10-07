import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Dashboard APIs
  getDashboardStats: () => api.get('/dashboard/incomereceivable'),
  
  // Appointments APIs
  getAppointments: () => api.get('/appointments/'),
  createAppointment: (data) => api.post('/appointments/', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}/`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}/`),
  
  // Patients APIs
  getPatients: () => api.get('/patient/'),
  getPatient: (id) => api.get(`/patient/${id}/`),
  createPatient: (data) => api.post('/patient/', data),
  updatePatient: (id, data) => api.put(`/patient/${id}/`, data),
  // These endpoints don't exist yet, will need backend implementation
  getPatientAppointments: (patientId) => api.get(`/appointments/`).then(res => ({
    data: { appointments: res.data.filter(apt => apt.patientId === patientId) }
  })),
  updatePatientContact: (patientId, data) => api.patch(`/patient/${patientId}/`, data),
  cancelAppointment: (appointmentId) => api.delete(`/appointments/${appointmentId}/`),
  
  // Treatments APIs
  getTreatments: () => api.get('/treatments/'),
  createTreatment: (data) => api.post('/treatments/', data),
  updateTreatment: (id, data) => api.put(`/treatments/${id}/`, data),
  
  // Medical History APIs
  getMedicalHistory: (patientId) => api.get(`/medical-history/${patientId}`),
  createMedicalHistory: (data) => api.post('/medical-history/', data),
  updateMedicalHistory: (id, data) => api.put(`/medical-history/${id}`, data),
  
  // Reports APIs
  getReports: (params) => api.get('/reports/', { params }),
  
  // SMS APIs
  getSMSStats: () => api.get('/sms/stats'),
  getSMSMessages: () => api.get('/sms/'),
  sendSMS: (data) => api.post('/sms/', data),
  
  // Payments APIs
  getPayments: () => api.get('/payment/'),
  createPayment: (data) => api.post('/payment/', data),
  updatePayment: (id, data) => api.put(`/payment/${id}`, data),
  deletePayment: (id) => api.delete(`/payment/${id}`),
  
  // User APIs
  getUsers: () => api.get('/users/'),
  createUser: (data) => api.post('/register/', data),
  updateUser: (id, data) => api.put(`/users/${id}/`, data),
  
  // Auth APIs
  login: (credentials) => api.post('/api-token-auth/', credentials),
  logout: () => api.post('/auth/logout/'),
  refreshToken: () => api.post('/auth/refresh/'),
  getCurrentUser: () => api.get('/api/auth/user/'),
  
  // Treatment Plans APIs
  getTreatmentPlans: () => api.get('/treatment-plans/'),
  getPatientTreatmentPlans: (patientId) => api.get(`/treatment-plans/patient/${patientId}`),
  getTreatmentPlan: (id) => api.get(`/treatment-plans/${id}`),
  createTreatmentPlan: (data) => api.post('/treatment-plans/', data),
  updateTreatmentPlan: (id, data) => api.put(`/treatment-plans/${id}`, data),
  updateTreatmentPlanStatus: (id, data) => api.patch(`/treatment-plans/${id}/status`, data),
  deleteTreatmentPlan: (id) => api.delete(`/treatment-plans/${id}`),
  addTreatmentPhase: (planId, data) => api.post(`/treatment-plans/${planId}/phases`, data),
  updateTreatmentPhase: (planId, phaseId, data) => api.put(`/treatment-plans/${planId}/phases/${phaseId}`, data),
  deleteTreatmentPhase: (planId, phaseId) => api.delete(`/treatment-plans/${planId}/phases/${phaseId}`),
  
  // Payment Plans APIs
  getPaymentPlans: () => api.get('/payment-plans/'),
  getPatientPaymentPlans: (patientId) => api.get(`/payment-plans/patient/${patientId}`),
  getPaymentPlan: (id) => api.get(`/payment-plans/${id}`),
  createPaymentPlan: (data) => api.post('/payment-plans/', data),
  updatePaymentPlan: (id, data) => api.put(`/payment-plans/${id}`, data),
  cancelPaymentPlan: (id) => api.patch(`/payment-plans/${id}/cancel`),
  deletePaymentPlan: (id) => api.delete(`/payment-plans/${id}`),
  payInstallment: (planId, installmentId, data) => api.post(`/payment-plans/${planId}/installments/${installmentId}/pay`, data),
  getOverdueInstallments: () => api.get('/payment-plans/overdue'),
};

export default api;