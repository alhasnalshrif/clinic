import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Temporary bypass for UI optimization
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
