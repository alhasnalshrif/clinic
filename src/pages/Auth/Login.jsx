import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Transform email to username for backend compatibility
      const credentials = {
        username: values.email,
        password: values.password
      };
      const success = await login(credentials);
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      message.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            نظام إدارة العيادة
          </Title>
          <Typography.Text type="secondary">
            مرحباً بك، يرجى تسجيل الدخول
          </Typography.Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="البريد الإلكتروني"
            rules={[
              { required: true, message: 'يرجى إدخال البريد الإلكتروني' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="البريد الإلكتروني"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[
              { required: true, message: 'يرجى إدخال كلمة المرور' },
              { min: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="كلمة المرور"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ height: 48 }}
            >
              تسجيل الدخول
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            © 2024 نظام إدارة العيادة. جميع الحقوق محفوظة.
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
