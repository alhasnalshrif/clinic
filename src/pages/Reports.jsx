import React, { useState, useEffect } from 'react';
import {
   Layout,
   Card,
   Row,
   Col,
   Typography,
   Select,
   DatePicker,
   Button,
   Space,
   Statistic,
   Progress,
   Table,
   Empty,
   Tabs,
   List,
   Avatar
} from 'antd';
import {
   BarChartOutlined,
   DollarOutlined,
   CalendarOutlined,
   UserOutlined,
   TrophyOutlined,
   ArrowUpOutlined,
   ArrowDownOutlined,
   DownloadOutlined,
   PrinterOutlined,
   LineChartOutlined,
   PieChartOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
   const [dateRange, setDateRange] = useState([
      moment().subtract(30, 'days'),
      moment()
   ]);
   const [reportType, setReportType] = useState('financial');
   const [loading, setLoading] = useState(false);
   const [reportData, setReportData] = useState({});

   // Mock data for demonstration
   useEffect(() => {
      const mockData = {
         financial: {
            totalRevenue: 125000,
            totalExpenses: 45000,
            netProfit: 80000,
            revenueGrowth: 15.2,
            averagePerPatient: 350,
            dailyRevenue: [
               { date: '2024-01-01', revenue: 2500, patients: 8 },
               { date: '2024-01-02', revenue: 3200, patients: 12 },
               { date: '2024-01-03', revenue: 2800, patients: 9 },
               { date: '2024-01-04', revenue: 4100, patients: 15 },
               { date: '2024-01-05', revenue: 3600, patients: 11 }
            ],
            topTreatments: [
               { treatment: 'تنظيف أسنان', revenue: 25000, count: 120 },
               { treatment: 'حشو تجميلي', revenue: 18000, count: 60 },
               { treatment: 'علاج جذور', revenue: 22000, count: 40 },
               { treatment: 'تقويم أسنان', revenue: 35000, count: 25 },
               { treatment: 'زراعة أسنان', revenue: 15000, count: 10 }
            ]
         },
         patients: {
            totalPatients: 456,
            newPatients: 67,
            returningPatients: 389,
            patientGrowth: 12.8,
            ageDistribution: [
               { range: '0-18', count: 89, percentage: 19.5 },
               { range: '19-35', count: 142, percentage: 31.1 },
               { range: '36-50', count: 134, percentage: 29.4 },
               { range: '51+', count: 91, percentage: 20.0 }
            ],
            genderDistribution: [
               { gender: 'ذكر', count: 234, percentage: 51.3 },
               { gender: 'أنثى', count: 222, percentage: 48.7 }
            ],
            topPatients: [
               { name: 'أحمد محمد', visits: 8, totalSpent: 4500 },
               { name: 'فاطمة علي', visits: 6, totalSpent: 3200 },
               { name: 'محمد أحمد', visits: 5, totalSpent: 2800 },
               { name: 'سارة حسن', visits: 7, totalSpent: 3900 }
            ]
         },
         appointments: {
            totalAppointments: 789,
            completedAppointments: 654,
            cancelledAppointments: 89,
            noShowAppointments: 46,
            completionRate: 82.9,
            averageWaitTime: 15,
            busyHours: [
               { hour: '09:00', appointments: 45 },
               { hour: '10:00', appointments: 67 },
               { hour: '11:00', appointments: 78 },
               { hour: '14:00', appointments: 65 },
               { hour: '15:00', appointments: 89 },
               { hour: '16:00', appointments: 56 }
            ],
            monthlyTrend: [
               { month: 'يناير', appointments: 234, completion: 85 },
               { month: 'فبراير', appointments: 267, completion: 82 },
               { month: 'مارس', appointments: 288, completion: 87 }
            ]
         },
         treatments: {
            totalTreatments: 892,
            completedTreatments: 756,
            ongoingTreatments: 89,
            pendingTreatments: 47,
            successRate: 94.2,
            treatmentTypes: [
               { type: 'تنظيف وقائي', count: 234, percentage: 26.2 },
               { type: 'حشو أسنان', count: 156, percentage: 17.5 },
               { type: 'علاج جذور', count: 98, percentage: 11.0 },
               { type: 'تقويم أسنان', count: 67, percentage: 7.5 },
               { type: 'جراحة فموية', count: 45, percentage: 5.0 }
            ],
            averageDuration: {
               'تنظيف أسنان': 45,
               'حشو تجميلي': 60,
               'علاج جذور': 90,
               'تقويم أسنان': 120,
               'زراعة أسنان': 180
            }
         }
      };
      setReportData(mockData);
   }, [dateRange, reportType]);

   const handleExport = (format) => {
      console.log(`Exporting report in ${format} format`);
      // Implementation for export functionality
   };

   const FinancialReport = () => (
      <Row gutter={[24, 24]}>
         {/* Financial KPIs */}
         <Col span={24}>
            <Row gutter={[24, 24]}>
               <Col span={6}>
                  <Card className="clinic-card metric-card income">
                     <Statistic
                        title={<span className="metric-title">إجمالي الإيرادات</span>}
                        value={reportData.financial?.totalRevenue}
                        valueStyle={{ color: 'var(--success-color)', fontSize: '24px' }}
                        prefix={<DollarOutlined />}
                        suffix="ر.س"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                     />
                     <div style={{ marginTop: 8 }}>
                        <Text type="success">
                           <ArrowUpOutlined /> +{reportData.financial?.revenueGrowth}%
                        </Text>
                        <Text type="secondary" style={{ marginRight: 8 }}>من الشهر الماضي</Text>
                     </div>
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">إجمالي المصروفات</span>}
                        value={reportData.financial?.totalExpenses}
                        valueStyle={{ color: 'var(--warning-color)', fontSize: '24px' }}
                        prefix={<DollarOutlined />}
                        suffix="ر.س"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">صافي الربح</span>}
                        value={reportData.financial?.netProfit}
                        valueStyle={{ color: 'var(--primary-color)', fontSize: '24px' }}
                        prefix={<TrophyOutlined />}
                        suffix="ر.س"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">متوسط الإيراد لكل مريض</span>}
                        value={reportData.financial?.averagePerPatient}
                        valueStyle={{ color: 'var(--secondary-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                        suffix="ر.س"
                     />
                  </Card>
               </Col>
            </Row>
         </Col>

         {/* Revenue Chart Placeholder */}
         <Col span={16}>
            <Card className="clinic-card" title="الإيرادات اليومية" extra={<LineChartOutlined />}>
               <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="مخطط الإيرادات اليومية (قريباً)" />
               </div>
            </Card>
         </Col>

         {/* Top Treatments */}
         <Col span={8}>
            <Card className="clinic-card" title="أعلى العلاجات إيراداً">
               <List
                  dataSource={reportData.financial?.topTreatments}
                  renderItem={(item, index) => (
                     <List.Item>
                        <List.Item.Meta
                           avatar={<Avatar style={{ backgroundColor: 'var(--primary-color)' }}>{index + 1}</Avatar>}
                           title={item.treatment}
                           description={
                              <Space direction="vertical" size={0}>
                                 <Text>{item.revenue?.toLocaleString()} ر.س</Text>
                                 <Text type="secondary">{item.count} مريض</Text>
                              </Space>
                           }
                        />
                     </List.Item>
                  )}
               />
            </Card>
         </Col>
      </Row>
   );

   const PatientsReport = () => (
      <Row gutter={[24, 24]}>
         {/* Patient KPIs */}
         <Col span={24}>
            <Row gutter={[24, 24]}>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">إجمالي المرضى</span>}
                        value={reportData.patients?.totalPatients}
                        valueStyle={{ color: 'var(--primary-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">مرضى جدد</span>}
                        value={reportData.patients?.newPatients}
                        valueStyle={{ color: 'var(--success-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                     <div style={{ marginTop: 8 }}>
                        <Text type="success">
                           <ArrowUpOutlined /> +{reportData.patients?.patientGrowth}%
                        </Text>
                        <Text type="secondary" style={{ marginRight: 8 }}>نمو شهري</Text>
                     </div>
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">مرضى عائدون</span>}
                        value={reportData.patients?.returningPatients}
                        valueStyle={{ color: 'var(--secondary-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card">
                     <div style={{ marginBottom: 16 }}>
                        <Text className="metric-title">معدل الاحتفاظ بالمرضى</Text>
                     </div>
                     <Progress 
                        percent={85} 
                        strokeColor="var(--success-color)"
                        format={percent => (
                           <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                              {percent}%
                           </span>
                        )}
                     />
                  </Card>
               </Col>
            </Row>
         </Col>

         {/* Age & Gender Distribution */}
         <Col span={12}>
            <Card className="clinic-card" title="توزيع المرضى حسب العمر">
               {reportData.patients?.ageDistribution?.map((item, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                     <Row justify="space-between" align="middle">
                        <Text>{item.range} سنة</Text>
                        <Text>{item.count} مريض</Text>
                     </Row>
                     <Progress 
                        percent={item.percentage} 
                        showInfo={false}
                        strokeColor="var(--primary-color)"
                     />
                  </div>
               ))}
            </Card>
         </Col>

         <Col span={12}>
            <Card className="clinic-card" title="توزيع المرضى حسب الجنس">
               <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="مخطط دائري للجنس (قريباً)" />
               </div>
            </Card>
         </Col>

         {/* Top Patients */}
         <Col span={24}>
            <Card className="clinic-card" title="أهم المرضى">
               <List
                  grid={{ gutter: 16, column: 4 }}
                  dataSource={reportData.patients?.topPatients}
                  renderItem={(item) => (
                     <List.Item>
                        <Card size="small">
                           <Statistic
                              title={item.name}
                              value={item.totalSpent}
                              valueStyle={{ fontSize: '18px', color: 'var(--primary-color)' }}
                              suffix="ر.س"
                           />
                           <Text type="secondary">{item.visits} زيارة</Text>
                        </Card>
                     </List.Item>
                  )}
               />
            </Card>
         </Col>
      </Row>
   );

   const AppointmentsReport = () => (
      <Row gutter={[24, 24]}>
         {/* Appointment KPIs */}
         <Col span={24}>
            <Row gutter={[24, 24]}>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">إجمالي المواعيد</span>}
                        value={reportData.appointments?.totalAppointments}
                        valueStyle={{ color: 'var(--primary-color)', fontSize: '24px' }}
                        prefix={<CalendarOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">مواعيد مكتملة</span>}
                        value={reportData.appointments?.completedAppointments}
                        valueStyle={{ color: 'var(--success-color)', fontSize: '24px' }}
                        prefix={<CalendarOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card">
                     <div style={{ marginBottom: 16 }}>
                        <Text className="metric-title">معدل الإكمال</Text>
                     </div>
                     <Progress 
                        percent={reportData.appointments?.completionRate} 
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
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">متوسط وقت الانتظار</span>}
                        value={reportData.appointments?.averageWaitTime}
                        valueStyle={{ color: 'var(--warning-color)', fontSize: '24px' }}
                        suffix="دقيقة"
                     />
                  </Card>
               </Col>
            </Row>
         </Col>

         {/* Busy Hours Chart */}
         <Col span={16}>
            <Card className="clinic-card" title="أوقات الذروة" extra={<BarChartOutlined />}>
               <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty description="مخطط أوقات الذروة (قريباً)" />
               </div>
            </Card>
         </Col>

         {/* Appointment Status */}
         <Col span={8}>
            <Card className="clinic-card" title="حالة المواعيد">
               <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                     <Row justify="space-between">
                        <Text>مكتملة</Text>
                        <Text strong>{reportData.appointments?.completedAppointments}</Text>
                     </Row>
                     <Progress 
                        percent={(reportData.appointments?.completedAppointments / reportData.appointments?.totalAppointments) * 100} 
                        showInfo={false}
                        strokeColor="var(--success-color)"
                     />
                  </div>
                  <div>
                     <Row justify="space-between">
                        <Text>ملغية</Text>
                        <Text strong>{reportData.appointments?.cancelledAppointments}</Text>
                     </Row>
                     <Progress 
                        percent={(reportData.appointments?.cancelledAppointments / reportData.appointments?.totalAppointments) * 100} 
                        showInfo={false}
                        strokeColor="var(--error-color)"
                     />
                  </div>
                  <div>
                     <Row justify="space-between">
                        <Text>عدم حضور</Text>
                        <Text strong>{reportData.appointments?.noShowAppointments}</Text>
                     </Row>
                     <Progress 
                        percent={(reportData.appointments?.noShowAppointments / reportData.appointments?.totalAppointments) * 100} 
                        showInfo={false}
                        strokeColor="var(--warning-color)"
                     />
                  </div>
               </Space>
            </Card>
         </Col>
      </Row>
   );

   const TreatmentsReport = () => (
      <Row gutter={[24, 24]}>
         {/* Treatment KPIs */}
         <Col span={24}>
            <Row gutter={[24, 24]}>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">إجمالي العلاجات</span>}
                        value={reportData.treatments?.totalTreatments}
                        valueStyle={{ color: 'var(--primary-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">علاجات مكتملة</span>}
                        value={reportData.treatments?.completedTreatments}
                        valueStyle={{ color: 'var(--success-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                  </Card>
               </Col>
               <Col span={6}>
                  <Card className="clinic-card">
                     <div style={{ marginBottom: 16 }}>
                        <Text className="metric-title">معدل النجاح</Text>
                     </div>
                     <Progress 
                        percent={reportData.treatments?.successRate} 
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
                  <Card className="clinic-card metric-card">
                     <Statistic
                        title={<span className="metric-title">علاجات معلقة</span>}
                        value={reportData.treatments?.pendingTreatments}
                        valueStyle={{ color: 'var(--warning-color)', fontSize: '24px' }}
                        prefix={<UserOutlined />}
                     />
                  </Card>
               </Col>
            </Row>
         </Col>

         {/* Treatment Types */}
         <Col span={12}>
            <Card className="clinic-card" title="أنواع العلاجات">
               {reportData.treatments?.treatmentTypes?.map((item, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                     <Row justify="space-between" align="middle">
                        <Text>{item.type}</Text>
                        <Text>{item.count} علاج</Text>
                     </Row>
                     <Progress 
                        percent={item.percentage} 
                        showInfo={false}
                        strokeColor="var(--primary-color)"
                     />
                  </div>
               ))}
            </Card>
         </Col>

         {/* Treatment Duration */}
         <Col span={12}>
            <Card className="clinic-card" title="متوسط مدة العلاج (دقيقة)">
               {Object.entries(reportData.treatments?.averageDuration || {}).map(([treatment, duration]) => (
                  <Row key={treatment} justify="space-between" style={{ marginBottom: 12 }}>
                     <Text>{treatment}</Text>
                     <Text strong>{duration} دقيقة</Text>
                  </Row>
               ))}
            </Card>
         </Col>
      </Row>
   );

   const reportComponents = {
      financial: <FinancialReport />,
      patients: <PatientsReport />,
      appointments: <AppointmentsReport />,
      treatments: <TreatmentsReport />
   };

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         <Card className="clinic-card" style={{ marginBottom: 24, padding: '24px' }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
                     <BarChartOutlined style={{ marginLeft: 12 }} />
                     التقارير والإحصائيات
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                     تحليل شامل لأداء العيادة والإحصائيات
                  </Text>
               </Col>
               <Col>
                  <Space>
                     <Button 
                        icon={<DownloadOutlined />} 
                        onClick={() => handleExport('pdf')}
                        className="clinic-btn-primary"
                     >
                        تصدير PDF
                     </Button>
                     <Button 
                        icon={<PrinterOutlined />} 
                        onClick={() => window.print()}
                     >
                        طباعة
                     </Button>
                  </Space>
               </Col>
            </Row>
         </Card>

         <Card className="clinic-card" style={{ marginBottom: 24, padding: '24px' }}>
            <Row gutter={16} align="middle">
               <Col span={6}>
                  <Select
                     style={{ width: '100%' }}
                     placeholder="نوع التقرير"
                     value={reportType}
                     onChange={setReportType}
                     size="large"
                  >
                     <Option value="financial">التقارير المالية</Option>
                     <Option value="patients">تقارير المرضى</Option>
                     <Option value="appointments">تقارير المواعيد</Option>
                     <Option value="treatments">تقارير العلاجات</Option>
                  </Select>
               </Col>
               <Col span={8}>
                  <RangePicker
                     style={{ width: '100%' }}
                     value={dateRange}
                     onChange={setDateRange}
                     format="DD/MM/YYYY"
                     size="large"
                  />
               </Col>
               <Col span={4}>
                  <Button 
                     type="primary" 
                     loading={loading}
                     size="large"
                     style={{ width: '100%' }}
                     className="clinic-btn-primary"
                  >
                     تحديث التقرير
                  </Button>
               </Col>
            </Row>
         </Card>

         <Card className="clinic-card" style={{ padding: '24px' }}>
            {reportComponents[reportType]}
         </Card>
      </Content>
   );
};

export default Reports;