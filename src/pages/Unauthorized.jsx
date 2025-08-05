import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة."
        extra={
          <div>
            {isAuthenticated ? (
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                style={{ marginLeft: 8 }}
              >
                العودة للرئيسية
              </Button>
            ) : (
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                onClick={handleLogin}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default Unauthorized;
