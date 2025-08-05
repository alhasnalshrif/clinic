import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, Card, Row, Col, Layout, Typography, Statistic, Empty, Button, Progress, Space, Alert } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { apiService } from '../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

function Dashboard(props) {

   const [state, setState] = useState({
      today_total_gross_income: 0,
      today_total_receivable: 0,
      all_total_gross_income: 0,
      all_total_receivable: 0,
      loading: true,
      error: null
   });

   const [appointment, setAppointment] = useState([]);
   const [dashboardStats, setDashboardStats] = useState({
      totalPatients: 0,
      todayAppointments: 0,
      completedToday: 0,
      pendingTreatments: 0,
      monthlyGrowth: 0,
      appointmentCompletion: 0
   });

   const getDashboardStats = useCallback(async () => {
      try {
         const res = await apiService.getDashboardStats();
         setState(prevState => ({
            ...prevState,
            ...res.data,
            loading: false,
            error: null
         }));
      } catch (error) {
         console.error('Error fetching dashboard stats:', error);
         setState(prevState => ({
            ...prevState,
            loading: false,
            error: 'فشل في تحميل البيانات'
         }));
      }
   }, []);

   const getAppointmentsTable = useCallback(async () => {
      try {
         const res = await apiService.getAppointments();
         setAppointment(res.data || []);
      } catch (error) {
         console.error('Error fetching appointments:', error);
         setAppointment([]);
      }
   }, []);

   useEffect(() => {
      const loadDashboardData = async () => {
         await Promise.all([
            getAppointmentsTable(),
            getDashboardStats()
         ]);
      };
      loadDashboardData();
   }, [getAppointmentsTable, getDashboardStats]);

   const calculateAdditionalStats = useCallback(async () => {
      try {
         // Calculate real stats based on actual data
         const today = new Date().toDateString();
         const todayAppointments = appointment?.filter(apt => 
            new Date(apt.appointment_time).toDateString() === today
         ).length || 0;
         
         const completedToday = appointment?.filter(apt => 
            new Date(apt.appointment_time).toDateString() === today && 
            apt.status === 'completed'
         ).length || 0;

         const stats = {
            totalPatients: 156, // This should come from API
            todayAppointments,
            completedToday,
            pendingTreatments: 23, // This should come from API
            monthlyGrowth: 12.5,
            appointmentCompletion: todayAppointments > 0 ? Math.round((completedToday / todayAppointments) * 100) : 0
         };
         
         setDashboardStats(stats);
      } catch (error) {
         console.error('Error calculating stats:', error);
      }
   }, [appointment]);

   useEffect(() => {
      calculateAdditionalStats();
   }, [calculateAdditionalStats]);

   const formatCurrency = useCallback((amount) => {
      if (isNaN(amount) || amount === null || amount === undefined) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }, []);



   if (state.loading) {
      return (
         <Content style={{ margin: '24px 24px 24px 36px' }}>
            <LoadingSkeleton type="dashboard" />
         </Content>
      );
   }

   if (state.error) {
      return (
         <Content style={{ margin: '24px 24px 24px 36px' }}>
            <Alert
               message="خطأ في تحميل البيانات"
               description={state.error}
               type="error"
               showIcon
               action={
                  <Button size="small" danger onClick={() => window.location.reload()}>
                     إعادة المحاولة
                  </Button>
               }
               style={{ marginBottom: 24 }}
            />
         </Content>
      );
   }

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         {/* Header Section */}
         <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
               <Typography.Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
                  لوحة التحكم
               </Typography.Title>
               <Typography.Text style={{ color: 'var(--text-secondary)' }}>
                  مرحباً بك في نظام إدارة العيادة
               </Typography.Text>
            </Col>
            <Col>
               <Space>
                  <Button 
                     type="primary" 
                     icon={<PlusOutlined />} 
                     className="clinic-btn-primary"
                  >
                     حجز جديد
                  </Button>
                  <Button 
                     icon={<EyeOutlined />}
                     className="clinic-btn-primary"
                     style={{ background: 'var(--secondary-color)', borderColor: 'var(--secondary-color)' }}
                  >
                     عرض التقارير
                  </Button>
               </Space>
            </Col>
         </Row>

         {/* Financial Metrics Row */}
         <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col span={6}>
               <Card className="clinic-card metric-card income">
                  <Statistic
                     title={<span className="metric-title">إجمالي الدخل اليوم</span>}
                     value={formatCurrency(state.today_total_gross_income)}
                     valueStyle={{ 
                        color: 'var(--success-color)', 
                        fontSize: '28px', 
                        fontWeight: 'bold' 
                     }}
                     prefix={<DollarOutlined />}
                     suffix={
                        <span style={{ fontSize: '14px', color: 'var(--success-color)' }}>
                           <ArrowUpOutlined /> +12%
                        </span>
                     }
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card metric-card receivable">
                  <Statistic
                     title={<span className="metric-title">المستحقات اليوم</span>}
                     value={formatCurrency(state.today_total_receivable)}
                     valueStyle={{ 
                        color: 'var(--warning-color)', 
                        fontSize: '28px', 
                        fontWeight: 'bold' 
                     }}
                     prefix={<ClockCircleOutlined />}
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card metric-card">
                  <Statistic
                     title={<span className="metric-title">إجمالي الدخل</span>}
                     value={formatCurrency(state.all_total_gross_income)}
                     valueStyle={{ 
                        color: 'var(--primary-color)', 
                        fontSize: '28px', 
                        fontWeight: 'bold' 
                     }}
                     prefix={<TrophyOutlined />}
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card metric-card">
                  <Statistic
                     title={<span className="metric-title">إجمالي المستحقات</span>}
                     value={formatCurrency(state.all_total_receivable)}
                     valueStyle={{ 
                        color: 'var(--text-primary)', 
                        fontSize: '28px', 
                        fontWeight: 'bold' 
                     }}
                     prefix={<DollarOutlined />}
                  />
               </Card>
            </Col>
         </Row>

         {/* Additional Stats Row */}
         <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col span={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span className="metric-title">إجمالي المرضى</span>}
                     value={dashboardStats.totalPatients}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '24px' }}
                     prefix={<UserOutlined />}
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span className="metric-title">مواعيد اليوم</span>}
                     value={dashboardStats.todayAppointments}
                     valueStyle={{ color: 'var(--secondary-color)', fontSize: '24px' }}
                     prefix={<CalendarOutlined />}
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card">
                  <div style={{ marginBottom: 16 }}>
                     <Typography.Text className="metric-title">نسبة إكمال المواعيد</Typography.Text>
                  </div>
                  <Progress 
                     percent={dashboardStats.appointmentCompletion} 
                     strokeColor="var(--success-color)"
                     format={percent => (
                        <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                           {percent}%
                        </span>
                     )}
                  />
               </Card>
            </Col>
            <Col span={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span className="metric-title">العلاجات المعلقة</span>}
                     value={dashboardStats.pendingTreatments}
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '24px' }}
                     prefix={<ClockCircleOutlined />}
                  />
               </Card>
            </Col>
         </Row>

         {/* Main Content Section */}
         <Card className="clinic-card" style={{ padding: '24px' }}>
            <Tabs 
               defaultActiveKey="1"
               size="large"
               items={[
                  {
                     key: "1",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <CalendarOutlined style={{ marginLeft: 8 }} />
                           الحجوزات
                        </span>
                     ),
                     children: appointment && appointment.length > 0 ? (
                        <AppointmentsTable 
                           appointments={appointment} 
                           onRefresh={getAppointmentsTable}
                        />
                     ) : (
                        <Empty
                           description={
                              <div className="empty-state">
                                 <CalendarOutlined className="empty-state-icon" />
                                 <div className="empty-state-title">لا توجد حجوزات اليوم</div>
                                 <div className="empty-state-description">
                                    سيتم عرض المواعيد المجدولة هنا
                                 </div>
                              </div>
                           }
                        />
                     )
                  },
                  {
                     key: "2", 
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <TrophyOutlined style={{ marginLeft: 8 }} />
                           الزيارات
                        </span>
                     ),
                     children: (
                        <Empty
                           description={
                              <div className="empty-state">
                                 <TrophyOutlined className="empty-state-icon" />
                                 <div className="empty-state-title">مخطط الزيارات قريباً</div>
                                 <div className="empty-state-description">
                                    سيتم إضافة مخطط بياني للزيارات قريباً
                                 </div>
                              </div>
                           }
                        />
                     )
                  }
               ]}
            />
         </Card>
      </Content>
   );
}



export default Dashboard;