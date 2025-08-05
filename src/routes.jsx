import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';

// Import existing pages
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import UserAccountSettings from './pages/UserAccountSettings';
import DentalRecords from './pages/DentalRecords';
import Payments from './pages/Payments';
import Appointments from './pages/Appointments';
import SMSTextMessaging from './pages/SMSTextMessaging';
import UserAccounts from './pages/UserAccounts';
import TreatmentPlanning from './pages/TreatmentPlanning';
import MedicalHistory from './pages/MedicalHistory';
import Reports from './pages/Reports';
import ServerConfigPage from './components/ServerConfig/ServerConfigPage';
import Unauthorized from './pages/Unauthorized';
import AuthExample from './components/AuthExample';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Routes - Main Layout */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Reception/Home */}
        <Route path="/home" element={<Reception />} />
        
        {/* Settings */}
        <Route path="/settings" element={<UserAccountSettings />} />
        
        {/* Dental Records */}
        <Route path="/dentalrecords" element={<DentalRecords />} />
        <Route path="/dentalrecords/:id" element={<DentalRecords />} />
        
        {/* Treatments */}
        <Route path="/treatments" element={<TreatmentPlanning />} />
        
        {/* Medical History */}
        <Route path="/medical-history" element={<MedicalHistory />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Payments */}
        <Route path="/transactionlog" element={<Payments />} />
        
        {/* Appointments */}
        <Route path="/appointments" element={<Appointments />} />
        
        {/* SMS */}
        <Route path="/sms" element={<SMSTextMessaging />} />
        
        {/* User Accounts */}
        <Route path="/useraccounts" element={<UserAccounts />} />
        <Route path="/useraccounts/:id" element={<UserAccounts />} />
        
        {/* Server Config */}
        <Route path="/server-config" element={<ServerConfigPage />} />
        
        {/* Auth Example */}
        <Route path="/auth-example" element={<AuthExample />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
