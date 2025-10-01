import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Row, 
  Col, 
  DatePicker, 
  Select, 
  Button, 
  Card,
  Typography,
  Space,
  Divider,
  message,
  Tooltip
} from 'antd';
import { 
  UsergroupAddOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  PhoneOutlined,
  BankOutlined,
  TeamOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

function CreateDentalRecord() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log('Form values:', values);
      
      // Format the date
      const formattedValues = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null
      };
      
      // Here you would normally make an API call
      // await apiService.createPatient(formattedValues);
      
      message.success('تم إنشاء السجل الطبي بنجاح');
      form.resetFields();
    } catch (error) {
      message.error('حدث خطأ في إنشاء السجل الطبي');
      console.error('Error creating dental record:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateContactNumber = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    // Saudi phone number regex
    const saudiRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
    // International format
    const internationalRegex = /^\+[1-9]\d{1,14}$/;
    
    if (saudiRegex.test(value) || internationalRegex.test(value)) {
      return Promise.resolve();
    }
    
    return Promise.reject(new Error('رقم الهاتف غير صحيح (مثال: +966501234567)'));
  };

  const validateAge = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const today = moment();
    const birthDate = moment(value);
    const age = today.diff(birthDate, 'years');
    
    if (age < 0 || age > 150) {
      return Promise.reject(new Error('تاريخ الميلاد غير صحيح'));
    }
    
    return Promise.resolve();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card className="clinic-card" style={{ border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-6)',
          color: 'white',
          textAlign: 'center'
        }}>
          <UsergroupAddOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            إنشاء سجل طبي جديد
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            إضافة مريض جديد إلى نظام العيادة
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark="optional"
          scrollToFirstError
        >
          {/* Personal Information Section */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
              👤 المعلومات الشخصية
            </Title>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="الاسم الكامل"
                  rules={[
                    { required: true, message: 'يرجى إدخال الاسم الكامل' },
                    { min: 2, message: 'يجب أن يكون الاسم على الأقل حرفين' },
                    { max: 100, message: 'الاسم طويل جداً' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: 'var(--text-secondary)' }} />}
                    placeholder="مثال: أحمد محمد العلي"
                    className="clinic-input"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="birthday"
                  label="تاريخ الميلاد"
                  rules={[
                    { required: true, message: 'يرجى اختيار تاريخ الميلاد' },
                    { validator: validateAge }
                  ]}
                >
                  <DatePicker
                    placeholder="اختيار التاريخ"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    showToday={false}
                    allowClear
                    suffixIcon={<CalendarOutlined style={{ color: 'var(--text-secondary)' }} />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="الجنس"
                  rules={[{ required: true, message: 'يرجى اختيار الجنس' }]}
                >
                  <Select
                    placeholder="اختيار الجنس"
                    allowClear
                    suffixIcon={<TeamOutlined style={{ color: 'var(--text-secondary)' }} />}
                  >
                    <Option value="male">ذكر</Option>
                    <Option value="female">أنثى</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="civilStatus"
                  label="الحالة الاجتماعية"
                >
                  <Select
                    placeholder="اختيار الحالة الاجتماعية"
                    allowClear
                    suffixIcon={<TeamOutlined style={{ color: 'var(--text-secondary)' }} />}
                  >
                    <Option value="single">أعزب</Option>
                    <Option value="married">متزوج</Option>
                    <Option value="divorced">مطلق</Option>
                    <Option value="widowed">أرمل</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: 'var(--spacing-6) 0' }} />

          {/* Contact Information Section */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
              📞 معلومات الاتصال
            </Title>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="contactNumber"
                  label="رقم الهاتف"
                  rules={[
                    { required: true, message: 'يرجى إدخال رقم الهاتف' },
                    { validator: validateContactNumber }
                  ]}
                  extra="مثال: +966501234567 أو 0501234567"
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: 'var(--text-secondary)' }} />}
                    placeholder="+966501234567"
                    className="clinic-input"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="البريد الإلكتروني"
                  rules={[
                    { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
                  ]}
                >
                  <Input
                    prefix="@"
                    placeholder="example@email.com"
                    className="clinic-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="العنوان"
              rules={[
                { required: true, message: 'يرجى إدخال العنوان' },
                { min: 10, message: 'العنوان قصير جداً' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="مثال: الرياض، حي النرجس، شارع الملك فهد، بناية رقم 123"
                className="clinic-input"
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: 'var(--spacing-6) 0' }} />

          {/* Professional Information Section */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
              💼 معلومات مهنية
            </Title>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="occupation"
                  label="المهنة"
                >
                  <Input
                    prefix={<BankOutlined style={{ color: 'var(--text-secondary)' }} />}
                    placeholder="مثال: مهندس، طبيب، معلم"
                    className="clinic-input"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="nationalId"
                  label="رقم الهوية الوطنية"
                  rules={[
                    { len: 10, message: 'رقم الهوية يجب أن يكون 10 أرقام' },
                    { pattern: /^\d{10}$/, message: 'رقم الهوية يجب أن يحتوي على أرقام فقط' }
                  ]}
                >
                  <Input
                    placeholder="1234567890"
                    className="clinic-input"
                    maxLength={10}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: 'var(--spacing-6) 0' }} />

          {/* Medical Information Section */}
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
              🩺 معلومات طبية أولية
            </Title>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bloodType"
                  label="فصيلة الدم"
                >
                  <Select
                    placeholder="اختيار فصيلة الدم"
                    allowClear
                  >
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyContact"
                  label="رقم الطوارئ"
                  rules={[
                    { validator: validateContactNumber }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: 'var(--error-color)' }} />}
                    placeholder="+966501234567"
                    className="clinic-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="medicalHistory"
              label="التاريخ المرضي"
              extra="الأمراض المزمنة، الحساسيات، الأدوية الحالية، إلخ"
            >
              <TextArea
                rows={4}
                placeholder="يرجى ذكر أي أمراض مزمنة أو حساسيات أو أدوية يتناولها المريض حالياً"
                className="clinic-input"
                maxLength={1000}
                showCount
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: 'var(--spacing-4)', 
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <Space size="middle">
              <Button 
                size="large"
                onClick={() => form.resetFields()}
                style={{ minWidth: 120 }}
              >
                إعادة تعيين
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<UsergroupAddOutlined />}
                className="clinic-btn-primary"
                style={{ minWidth: 180 }}
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء السجل الطبي'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default CreateDentalRecord;