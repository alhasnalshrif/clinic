import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Divider, Typography, Form, Input, Button, Alert, message } from 'antd';
import { UserAddOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Navigate, useLocation } from "react-router-dom";
import { useLogin } from "../auth/hooks";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { login, isSubmitting, error, clearError } = useLogin();
  const location = useLocation();
  
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formValues;

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const onFinish = async (values) => {
    try {
      const result = await login({
        username: values.username,
        password: values.password
      });

      if (result.success) {
        message.success('تم تسجيل الدخول بنجاح');
        // Navigation will be handled by the auth context
      } else {
        message.error(result.error || 'فشل في تسجيل الدخول');
      }
    } catch (err) {
      message.error('حدث خطأ غير متوقع');
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) clearError();
    };
  }, [error, clearError]);

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || "/";
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Row type="flex" align="middle" style={{ minHeight: '100vh' }}>
        <Col md={{ span: 8, offset: 8 }} sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
          <Card 
            bordered={true} 
            style={{ 
              boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title style={{ marginTop: 18, marginBottom: 0 }} level={3}>
                عيادة الأسنان
              </Title>
              <Typography.Text type="secondary">
                تسجيل الدخول إلى النظام
              </Typography.Text>
            </div>
            
            <Divider style={{ margin: '6px 0 24px 0' }} />

            {error && (
              <Alert
                message="خطأ في تسجيل الدخول"
                description={error}
                type="error"
                showIcon
                closable
                onClose={clearError}
                style={{ marginBottom: 16 }}
              />
            )}

            <Form
              form={form}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                label="اسم المستخدم"
                name="username"
                rules={[
                  { required: true, message: 'يرجى إدخال اسم المستخدم!' },
                  { min: 3, message: 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف' }
                ]}
              >
                <Input
                  prefix={<UserAddOutlined className="site-form-item-icon" />}
                  placeholder="اسم المستخدم"
                  name="username"
                  value={username}
                  onChange={onChange}
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                label="كلمة المرور"
                name="password"
                rules={[
                  { required: true, message: 'يرجى إدخال كلمة المرور!' },
                  { min: 4, message: 'كلمة المرور يجب أن تكون على الأقل 4 أحرف' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="كلمة المرور"
                  name="password"
                  value={password}
                  onChange={onChange}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={isSubmitting}
                  icon={<LoginOutlined />}
                >
                  {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                © 2025 عيادة الأسنان - جميع الحقوق محفوظة
              </Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
