import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
   Layout, 
   Card, 
   Typography, 
   Row, 
   Col, 
   Statistic, 
   Button, 
   Space, 
   Alert,
   Tooltip,
   Badge,
   Input,
   Select,
   DatePicker
} from 'antd';
import {
   UserOutlined,
   MedicineBoxOutlined,
   PlusOutlined,
   SearchOutlined,
   FilterOutlined,
   ReloadOutlined,
   ArrowLeftOutlined,
   HeartOutlined,
   CalendarOutlined,
   PhoneOutlined
} from '@ant-design/icons';
import DentalRecord from '../components/DentalRecord/DentalRecord';
import DentalRecordsTable from '../components/DentalRecord/DentalRecordsTable';
import { apiService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function DentalRecords(props) {
   const { id } = useParams();
   const navigate = useNavigate();
   const [patients, setPatients] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const fetchPatients = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await apiService.getPatients();
         setPatients(response.data || []);
      } catch (error) {
         console.error('Error fetching patients:', error);
         setError('فشل في تحميل قائمة المرضى');
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      if (!id) {
         fetchPatients();
      }
   }, [id, fetchPatients]);

   const handleRefresh = () => {
      fetchPatients();
   };

   const handleAddPatient = () => {
      navigate('/home'); // Navigate to reception page for patient registration
   };

   // Individual patient dental record view
   if (id) {
      return (
         <Content style={{ padding: 'var(--spacing-6)' }}>
            {/* Header with back button */}
            <Card className="clinic-card" style={{ 
               marginBottom: 'var(--spacing-6)', 
               background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', 
               border: 'none',
               color: 'white'
            }}>
               <Row justify="space-between" align="middle">
                  <Col>
                     <Space size="middle">
                        <Tooltip title="العودة إلى قائمة المرضى">
                           <Button 
                              icon={<ArrowLeftOutlined />}
                              onClick={() => navigate('/dentalrecords')}
                              size="large"
                              style={{ 
                                 background: 'rgba(255, 255, 255, 0.2)', 
                                 borderColor: 'rgba(255, 255, 255, 0.3)',
                                 color: 'white'
                              }}
                           >
                              رجوع
                           </Button>
                        </Tooltip>
                        <Space direction="vertical" size="small">
                           <Title level={2} style={{ margin: 0, color: 'white' }}>
                              <MedicineBoxOutlined style={{ marginLeft: 12 }} />
                              السجل الطبي للأسنان
                           </Title>
                           <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              عرض وإدارة السجل الطبي التفصيلي للمريض
                           </Text>
                        </Space>
                     </Space>
                  </Col>
               </Row>
            </Card>

            <DentalRecord id={id} />
         </Content>
      );
   }

   // Patients list view
   return (
      <Content style={{ padding: 'var(--spacing-6)' }}>
         {/* Header Section */}
         <Card className="clinic-card" style={{ 
            marginBottom: 'var(--spacing-6)', 
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <UserOutlined style={{ marginLeft: 12 }} />
                        إدارة المرضى
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        عرض وإدارة السجلات الطبية لجميع مرضى الأسنان
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث قائمة المرضى">
                        <Button 
                           icon={<ReloadOutlined />}
                           loading={loading}
                           onClick={handleRefresh}
                           size="large"
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           تحديث
                        </Button>
                     </Tooltip>
                     <Tooltip title="تسجيل مريض جديد">
                        <Button 
                           type="default"
                           icon={<PlusOutlined />}
                           size="large"
                           onClick={handleAddPatient}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           مريض جديد
                        </Button>
                     </Tooltip>
                  </Space>
               </Col>
            </Row>
         </Card>

         {/* Statistics Cards */}
         <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>إجمالي المرضى</span>}
                     value={patients.length}
                     prefix={<UserOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>المرضى النشطون</span>}
                     value={patients.length}
                     prefix={<HeartOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>المرضى الجدد</span>}
                     value={patients.filter(p => {
                        const createdDate = new Date(p.createdAt);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return createdDate > thirtyDaysAgo;
                     }).length}
                     prefix={<CalendarOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)', fontSize: '28px', fontWeight: 'bold' }}
                     suffix={<Text type="secondary" style={{ fontSize: '12px' }}>(آخر 30 يوم)</Text>}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>لديهم رقم هاتف</span>}
                     value={patients.filter(p => p.phone && p.phone.trim()).length}
                     prefix={
                        <Badge 
                           count={patients.filter(p => !p.phone || !p.phone.trim()).length} 
                           size="small"
                           title="مرضى بدون رقم هاتف"
                        >
                           <PhoneOutlined style={{ color: 'var(--warning-color)' }} />
                        </Badge>
                     }
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
         </Row>

         {error && (
            <Alert
               message="خطأ في تحميل البيانات"
               description={error}
               type="error"
               showIcon
               closable
               style={{ marginBottom: 'var(--spacing-6)' }}
               action={
                  <Button size="small" onClick={handleRefresh} loading={loading}>
                     إعادة المحاولة
                  </Button>
               }
            />
         )}

         {/* Main Content */}
         <Card className="clinic-card">
            <DentalRecordsTable patients={patients} loading={loading} onRefresh={handleRefresh} />
         </Card>
      </Content>
   );
}

export default DentalRecords;