# 🏗️ Technical Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Pages     │ │ Components  │ │   Hooks     │          │
│  │             │ │             │ │             │          │
│  │ Dashboard   │ │ Common      │ │ useApi      │          │
│  │ Reception   │ │ Forms       │ │ useForm     │          │
│  │ Patients    │ │ Tables      │ │ useStorage  │          │
│  │ ...         │ │ Layouts     │ │ ...         │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  Services   │ │   Utils     │ │   Config    │          │
│  │             │ │             │ │             │          │
│  │ API Client  │ │ Validators  │ │ App Config  │          │
│  │ Auth        │ │ Formatters  │ │ Constants   │          │
│  │ Storage     │ │ Helpers     │ │ Theme       │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Routes    │ │ Controllers │ │ Middleware  │          │
│  │             │ │             │ │             │          │
│  │ /api/auth   │ │ AuthCtrl    │ │ Auth Guard  │          │
│  │ /api/users  │ │ UserCtrl    │ │ CORS        │          │
│  │ /api/...    │ │ ...         │ │ Validation  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Models    │ │  Services   │ │   Utils     │          │
│  │             │ │             │ │             │          │
│  │ User        │ │ Email       │ │ Encryption  │          │
│  │ Patient     │ │ SMS         │ │ Validation  │          │
│  │ ...         │ │ ...         │ │ ...         │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Database (MySQL/PostgreSQL)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Users     │ │  Patients   │ │Appointments │          │
│  │ Treatments  │ │  Payments   │ │  Reports    │          │
│  │   Audit     │ │ Medical Hx  │ │   Files     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
clinic/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   ├── favicon.ico        # Favicon
│   └── manifest.json      # PWA manifest
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── FormInput.jsx
│   │   │   └── ...
│   │   ├── forms/         # Form components
│   │   ├── tables/        # Table components
│   │   └── layouts/       # Layout components
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Reception.jsx
│   │   ├── Appointments.jsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useForm.js
│   │   ├── useLocalStorage.js
│   │   └── ...
│   ├── services/          # API and external services
│   │   ├── api.js         # Axios API client
│   │   ├── auth.js        # Authentication service
│   │   └── storage.js     # Local storage service
│   ├── utils/             # Utility functions
│   │   ├── validators.js  # Form validation
│   │   ├── formatters.js  # Data formatting
│   │   ├── constants.js   # App constants
│   │   └── helpers.js     # Helper functions
│   ├── config/            # Configuration files
│   │   ├── app.js         # App configuration
│   │   ├── theme.js       # Theme configuration
│   │   └── routes.js      # Route definitions
│   ├── redux/             # Redux store (if used)
│   │   ├── store.js
│   │   ├── slices/
│   │   └── ...
│   ├── containers/        # Container components
│   │   └── Layout.jsx
│   ├── App.jsx            # Main App component
│   ├── index.js           # App entry point
│   └── index.css          # Global styles
├── backend/               # Backend source code
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── models/            # Data models
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic services
│   ├── utils/             # Backend utilities
│   ├── config/            # Backend configuration
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── .env                   # Environment variables
├── package.json           # Frontend dependencies
├── README.md              # This file
└── ...
```

## Component Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── Router
└── Layout
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Menu
    │   └── User Profile
    ├── Header
    │   ├── Breadcrumb
    │   ├── Search
    │   └── Notifications
    └── Content
        ├── Route Components (Lazy Loaded)
        │   ├── Dashboard
        │   ├── Reception
        │   ├── Appointments
        │   └── ...
        └── LoadingSkeleton (fallback)
```

### Component Patterns

#### 1. Functional Components with Hooks
```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const { loading, error, fetchData } = useApi();

  const loadPatients = useCallback(async () => {
    const data = await fetchData('/api/patients');
    setPatients(data);
  }, [fetchData]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default PatientList;
```

#### 2. Custom Hooks Pattern
```jsx
// hooks/useApi.js
import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get(url, options);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
};
```

#### 3. Error Boundary Pattern
```jsx
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="حدث خطأ غير متوقع"
          subTitle="عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى."
          extra={
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              إعادة تحديث الصفحة
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## State Management

### Redux Toolkit Setup
```jsx
// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import patientsSlice from './slices/patientsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
```

### Slice Pattern
```jsx
// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

## API Integration

### API Service Setup
```jsx
// services/api.js
import axios from 'axios';
import { notification } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiService.interceptors.request.use(
  (config) => {
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
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'حدث خطأ في الاتصال';
    notification.error({
      message: 'خطأ',
      description: message,
      placement: 'topRight',
    });
    
    return Promise.reject(error);
  }
);

export default apiService;
```

### API Endpoints
```jsx
// services/endpoints.js
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  
  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id) => `/patients/${id}`,
  PATIENT_HISTORY: (id) => `/patients/${id}/history`,
  
  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: (id) => `/appointments/${id}`,
  
  // Treatments
  TREATMENTS: '/treatments',
  TREATMENT_PLANS: '/treatment-plans',
  
  // Reports
  FINANCIAL_REPORTS: '/reports/financial',
  PATIENT_REPORTS: '/reports/patients',
};
```

## Performance Optimizations

### Lazy Loading Implementation
```jsx
// App.jsx
import React, { Suspense } from 'react';
import LoadingSkeleton from './components/common/LoadingSkeleton';

// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Reception = React.lazy(() => import('./pages/Reception'));

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reception" element={<Reception />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization Strategies
```jsx
import React, { useMemo, useCallback } from 'react';

const PatientTable = ({ patients, filters }) => {
  // Memoize filtered data
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      return patient.name.includes(filters.search) &&
             patient.status === filters.status;
    });
  }, [patients, filters]);

  // Memoize callback functions
  const handlePatientClick = useCallback((patientId) => {
    // Handle patient selection
  }, []);

  return (
    <Table 
      dataSource={filteredPatients}
      onRow={(record) => ({
        onClick: () => handlePatientClick(record.id)
      })}
    />
  );
};

export default React.memo(PatientTable);
```

### Bundle Optimization
```jsx
// webpack optimization in package.json
{
  "scripts": {
    "build": "react-scripts build",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

## Testing Strategy

### Unit Testing with Jest
```jsx
// __tests__/components/PatientCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PatientCard from '../components/PatientCard';

describe('PatientCard', () => {
  const mockPatient = {
    id: 1,
    name: 'John Doe',
    phone: '123-456-7890',
    status: 'active'
  };

  test('renders patient information correctly', () => {
    render(<PatientCard patient={mockPatient} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<PatientCard patient={mockPatient} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockPatient.id);
  });
});
```

### Integration Testing
```jsx
// __tests__/integration/PatientFlow.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import PatientManagement from '../pages/PatientManagement';

test('complete patient creation flow', async () => {
  const user = userEvent.setup();
  
  render(
    <Provider store={store}>
      <PatientManagement />
    </Provider>
  );

  // Click add patient button
  await user.click(screen.getByText('إضافة مريض جديد'));
  
  // Fill form
  await user.type(screen.getByLabelText('الاسم'), 'John Doe');
  await user.type(screen.getByLabelText('الهاتف'), '123-456-7890');
  
  // Submit form
  await user.click(screen.getByText('حفظ'));
  
  // Verify patient was added
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Serve with static server
npx serve -s build -l 3000
```

### Environment Configuration
```env
# .env.production
REACT_APP_API_URL=https://api.clinic.com
REACT_APP_CLINIC_NAME="عيادة الأسنان المتقدمة"
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Docker Setup
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Security Considerations

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Secure token storage in httpOnly cookies
- Token refresh mechanism
- Session timeout handling

### Data Protection
- Input validation and sanitization
- XSS protection with CSP headers
- CSRF protection with tokens
- SQL injection prevention
- File upload restrictions

### API Security
- Rate limiting on API endpoints
- CORS configuration
- Request/response validation
- Error handling without information leakage
- API versioning for backward compatibility

### Frontend Security
- Environment variable protection
- Bundle analysis for vulnerabilities
- Dependencies security scanning
- Content Security Policy implementation
- Secure communication (HTTPS only)

## Monitoring & Analytics

### Error Tracking
```jsx
// utils/errorTracking.js
class ErrorTracker {
  static logError(error, context = {}) {
    // Log to external service (e.g., Sentry)
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
  
  static trackUserAction(action, data = {}) {
    // Track user interactions
    console.log('User Action:', {
      action,
      data,
      timestamp: new Date().toISOString(),
      userId: getCurrentUserId()
    });
  }
}

export default ErrorTracker;
```

### Performance Monitoring
```jsx
// utils/performance.js
class PerformanceMonitor {
  static measurePageLoad() {
    if (window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log('Page Load Time:', loadTime + 'ms');
      return loadTime;
    }
  }
  
  static measureComponent(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} execution time:`, (end - start) + 'ms');
    return result;
  }
}

export default PerformanceMonitor;
```

---

This technical documentation provides a comprehensive overview of the dental clinic management system's architecture, patterns, and implementation details. It serves as a guide for developers working on the project and establishes standards for code quality and system design.