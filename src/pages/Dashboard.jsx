import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Tabs, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Empty, 
  Button, 
  Progress, 
  Space, 
  Alert,
  Spin,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  StarFilled,
  WarningOutlined
} from '@ant-design/icons';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { apiService } from '../services/api';

const { Title, Text, Paragraph } = Typography;

function Dashboard() {
  const [state, setState] = useState({
    today_total_gross_income: 0,
    today_total_receivable: 0,
    all_total_gross_income: 150,
    all_total_receivable: 150,
    loading: false,
    error: null
  });

  const [appointment, setAppointment] = useState([
    {
      id: 1,
      patient: { name: 'John Doe', phone: '+1234567890' },
      appointment_date: '15/01/2024',
      appointment_time: '12:00 AM',
      reason: 'Regular checkup',
      status: 'في الانتظار'
    },
    {
      id: 2,
      patient: { name: 'Jane Smith', phone: '+0987654321' },
      appointment_date: '16/01/2024',
      appointment_time: '12:00 AM',
      reason: 'Tooth cleaning',
      status: 'في الانتظار'
    }
  ]);

  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 156,
    todayAppointments: 0,
    completedToday: 0,
    pendingTreatments: 23,
    monthlyGrowth: 12,
    appointmentCompletion: 0,
    todayRevenue: 0,
    weeklyGrowth: 8,
    urgentCases: 3,
    todayTreatments: 5
  });

  const getDashboardStats = useCallback(async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      // Mock API call - in real app this would fetch from backend
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: null
        }));
      }, 1000);
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  }, []);

  useEffect(() => {
    getDashboardStats();
  }, [getDashboardStats]);

  // Enhanced metrics with better styling
  const metricCards = useMemo(() => [
    {
      title: 'إجمالي الدخل اليوم',
      value: state.today_total_gross_income,
      prefix: <DollarOutlined style={{ color: 'var(--success-color)' }} />,
      suffix: 'ريال',
      change: dashboardStats.monthlyGrowth,
      changeType: 'increase',
      color: 'var(--success-color)',
      bgColor: 'var(--success-color)10'
    },
    {
      title: 'المستحقات اليوم',
      value: state.today_total_receivable,
      prefix: <ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />,
      suffix: 'ريال',
      color: 'var(--warning-color)',
      bgColor: 'var(--warning-color)10'
    },
    {
      title: 'إجمالي الدخل',
      value: state.all_total_gross_income,
      prefix: <TrophyOutlined style={{ color: 'var(--primary-color)' }} />,
      suffix: 'ريال',
      color: 'var(--primary-color)',
      bgColor: 'var(--primary-color)10'
    },
    {
      title: 'إجمالي المستحقات',
      value: state.all_total_receivable,
      prefix: <DollarOutlined style={{ color: 'var(--error-color)' }} />,
      suffix: 'ريال',
      color: 'var(--error-color)',
      bgColor: 'var(--error-color)10'
    }
  ], [state, dashboardStats]);

  const statsCards = useMemo(() => [
    {
      title: 'إجمالي المرضى',
      value: dashboardStats.totalPatients,
      prefix: <UserOutlined style={{ color: 'var(--info-color)' }} />,
      color: 'var(--info-color)',
      bgColor: 'var(--info-color)10'
    },
    {
      title: 'مواعيد اليوم',
      value: dashboardStats.todayAppointments,
      prefix: <CalendarOutlined style={{ color: 'var(--secondary-color)' }} />,
      color: 'var(--secondary-color)',
      bgColor: 'var(--secondary-color)10'
    },
    {
      title: 'العلاجات المعلقة',
      value: dashboardStats.pendingTreatments,
      prefix: <ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />,
      suffix: dashboardStats.urgentCases > 0 ? (
        <Badge count={dashboardStats.urgentCases} size="small">
          <WarningOutlined style={{ color: 'var(--error-color)', marginRight: 4 }} />
        </Badge>
      ) : null,
      color: 'var(--warning-color)',
      bgColor: 'var(--warning-color)10'
    },
    {
      title: 'العلاجات اليوم',
      value: dashboardStats.todayTreatments,
      prefix: <HeartOutlined style={{ color: 'var(--success-color)' }} />,
      color: 'var(--success-color)',
      bgColor: 'var(--success-color)10'
    }
  ], [dashboardStats]);

  const handleNewAppointment = () => {
    console.log('Navigate to new appointment');
  };

  const handleViewReports = () => {
    console.log('Navigate to reports');
  };

  if (state.loading) {
    return (
      <div style={{ padding: 'var(--spacing-6)' }}>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Page Header */}
      <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)', border: 'none', background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)', color: 'white' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'white' }}>
              لوحة التحكم
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
              مرحباً بك في نظام إدارة العيادة - نظرة شاملة على أداء العيادة
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Tooltip title="إنشاء حجز جديد">
                <Button 
                  type="default" 
                  icon={<PlusOutlined />} 
                  size="large"
                  onClick={handleNewAppointment}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  حجز جديد
                </Button>
              </Tooltip>
              <Tooltip title="عرض جميع التقارير">
                <Button 
                  type="default"
                  icon={<EyeOutlined />} 
                  size="large"
                  onClick={handleViewReports}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  عرض التقارير
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Financial Metrics */}
      <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
            📊 المؤشرات المالية
          </Title>
          <Text type="secondary">نظرة عامة على الأداء المالي للعيادة</Text>
        </div>
        <Row gutter={[24, 24]}>
          {metricCards.map((metric, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="metric-card clinic-card" 
                style={{ 
                  background: metric.bgColor,
                  border: `1px solid ${metric.color}20`,
                  textAlign: 'center'
                }}
              >
                <Statistic
                  title={
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500
                    }}>
                      {metric.title}
                    </span>
                  }
                  value={metric.value}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                  valueStyle={{ 
                    color: metric.color, 
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700
                  }}
                />
                {metric.change && (
                  <div style={{ marginTop: 'var(--spacing-2)' }}>
                    <Space size="small">
                      <ArrowUpOutlined style={{ color: 'var(--success-color)' }} />
                      <Text style={{ color: 'var(--success-color)', fontSize: 'var(--text-sm)' }}>
                        +{metric.change}%
                      </Text>
                    </Space>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Operational Stats */}
      <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
            📈 إحصائيات العمليات
          </Title>
          <Text type="secondary">مؤشرات الأداء التشغيلي اليومية</Text>
        </div>
        <Row gutter={[24, 24]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                className="metric-card clinic-card" 
                style={{ 
                  background: stat.bgColor,
                  border: `1px solid ${stat.color}20`,
                  textAlign: 'center'
                }}
              >
                <Statistic
                  title={
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500
                    }}>
                      {stat.title}
                    </span>
                  }
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  valueStyle={{ 
                    color: stat.color, 
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Progress Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
        <Col xs={24} lg={8}>
          <Card className="clinic-card" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={5} style={{ color: 'var(--text-primary)' }}>
                نسبة إكمال المواعيد
              </Title>
              <Progress 
                type="circle"
                percent={dashboardStats.appointmentCompletion} 
                strokeColor={{
                  '0%': 'var(--success-color)',
                  '100%': 'var(--secondary-color)',
                }}
                format={(percent) => (
                  <span style={{ color: 'var(--success-color)', fontWeight: 'bold', fontSize: 'var(--text-lg)' }}>
                    {percent}%
                  </span>
                )}
                size={120}
              />
              <Paragraph style={{ marginTop: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
                معدل إنجاز المواعيد المجدولة لهذا الشهر
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card className="clinic-card" style={{ height: '100%' }}>
            <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-4)' }}>
              🎯 أهداف الشهر
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ padding: 'var(--spacing-3)', background: 'var(--success-color)10', borderRadius: 'var(--radius-lg)', border: '1px solid var(--success-color)20' }}>
                  <Text style={{ fontSize: 'var(--text-xs)', color: 'var(--success-color)' }}>المرضى الجدد</Text>
                  <Progress percent={75} showInfo={false} strokeColor="var(--success-color)" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <Text style={{ fontSize: 'var(--text-xs)' }}>75 من 100</Text>
                    <Text style={{ fontSize: 'var(--text-xs)', color: 'var(--success-color)' }}>+5 هذا الأسبوع</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 'var(--spacing-3)', background: 'var(--primary-color)10', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-color)20' }}>
                  <Text style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-color)' }}>الإيرادات الشهرية</Text>
                  <Progress percent={60} showInfo={false} strokeColor="var(--primary-color)" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <Text style={{ fontSize: 'var(--text-xs)' }}>60,000 من 100,000</Text>
                    <Text style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-color)' }}>ريال</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Appointments and Activities */}
      <Card className="clinic-card">
        <Tabs 
          size="large"
          items={[
            {
              key: "1",
              label: (
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                  <CalendarOutlined style={{ marginLeft: 8 }} />
                  الحجوزات
                  <Badge count={appointment.length} size="small" style={{ marginRight: 8 }} />
                </span>
              ),
              children: (
                <div>
                  {appointment.length > 0 ? (
                    <AppointmentsTable data={appointment} />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
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
                  )}
                </div>
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
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
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
    </div>
  );
}

export default Dashboard;