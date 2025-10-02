import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
   Avatar,
   Alert,
   Badge,
   Tooltip,
   Tag,
   Divider,
   Radio
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
   PieChartOutlined,
   ReloadOutlined,
   FileTextOutlined,
   HeartOutlined,
   MedicineBoxOutlined,
   ClockCircleOutlined,
   CheckCircleOutlined,
   WarningOutlined,
   TeamOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { apiService } from '../services/api';
import { message } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
   const [dateRange, setDateRange] = useState([
      moment().subtract(30, 'days'),
      moment()
   ]);
   const [reportType, setReportType] = useState('overview');
   const [loading, setLoading] = useState(false);
   const [reportData, setReportData] = useState({});
   const [activeTab, setActiveTab] = useState('financial');

   useEffect(() => {
      generateReport();
   }, [dateRange, reportType]);

   const generateReport = useCallback(async () => {
      setLoading(true);
      try {
         // Fetch report data from backend API
         const params = {
            startDate: dateRange[0]?.format('YYYY-MM-DD'),
            endDate: dateRange[1]?.format('YYYY-MM-DD'),
            reportType: reportType
         };
         const response = await apiService.getReports(params);
         setReportData(response.data || {});
         message.success('تم تحميل التقرير بنجاح');
      } catch (error) {
         console.error('Error generating report:', error);
         message.error('فشل في تحميل التقرير');
         setReportData({});
      } finally {
         setLoading(false);
      }
   }, [dateRange, reportType]);

   const handleExportPDF = () => {
      // Simulate PDF export
      message.success('تم تحميل التقرير بصيغة PDF');
   };

   const handlePrint = () => {
      window.print();
   };

   const calculateGrowth = (current, previous) => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
   };

   // Financial Report Content
   const FinancialReport = () => (
      <div>
         <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="إجمالي الإيرادات"
                     value={reportData.financial?.totalRevenue}
                     prefix={<TrophyOutlined style={{ color: 'var(--success-color)' }} />}
                     suffix="ريال"
                     valueStyle={{ color: 'var(--success-color)' }}
                  />
                  <div style={{ marginTop: 8 }}>
                     <ArrowUpOutlined style={{ color: 'var(--success-color)' }} />
                     <Text style={{ color: 'var(--success-color)', marginLeft: 4 }}>
                        +12% من الشهر الماضي
                     </Text>
                  </div>
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="إيرادات الشهر"
                     value={reportData.financial?.monthlyRevenue}
                     prefix={<CalendarOutlined style={{ color: 'var(--primary-color)' }} />}
                     suffix="ريال"
                     valueStyle={{ color: 'var(--primary-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="متوسط يومي"
                     value={reportData.financial?.dailyAverage}
                     prefix={<BarChartOutlined style={{ color: 'var(--info-color)' }} />}
                     suffix="ريال"
                     valueStyle={{ color: 'var(--info-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="مدفوعات معلقة"
                     value={reportData.financial?.pendingPayments}
                     prefix={<ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />}
                     suffix="ريال"
                     valueStyle={{ color: 'var(--warning-color)' }}
                  />
               </Card>
            </Col>
         </Row>

         <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
               <Card title="الاتجاه الشهري" className="clinic-card">
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Empty description="سيتم إضافة الرسم البياني قريباً" />
                  </div>
               </Card>
            </Col>
            <Col xs={24} lg={8}>
               <Card title="طرق الدفع" className="clinic-card">
                  <Space direction="vertical" style={{ width: '100%' }}>
                     {reportData.financial?.paymentMethods?.map((method, index) => (
                        <div key={index}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <Text>{method.method}</Text>
                              <Text strong>{method.percentage}%</Text>
                           </div>
                           <Progress 
                              percent={method.percentage} 
                              showInfo={false}
                              strokeColor={
                                 index === 0 ? 'var(--success-color)' :
                                 index === 1 ? 'var(--primary-color)' : 'var(--info-color)'
                              }
                           />
                        </div>
                     ))}
                  </Space>
               </Card>
            </Col>
         </Row>
      </div>
   );

   // Patients Report Content
   const PatientsReport = () => (
      <div>
         <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="إجمالي المرضى"
                     value={reportData.patients?.totalPatients}
                     prefix={<UserOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="مرضى جدد"
                     value={reportData.patients?.newPatients}
                     prefix={<Badge count="جديد" size="small"><UserOutlined style={{ color: 'var(--success-color)' }} /></Badge>}
                     valueStyle={{ color: 'var(--success-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="مرضى نشطون"
                     value={reportData.patients?.activePatients}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="مرضى عائدون"
                     value={reportData.patients?.returningPatients}
                     prefix={<HeartOutlined style={{ color: 'var(--warning-color)' }} />}
                     valueStyle={{ color: 'var(--warning-color)' }}
                  />
               </Card>
            </Col>
         </Row>

         <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
               <Card title="التوزيع العمري" className="clinic-card">
                  <Space direction="vertical" style={{ width: '100%' }}>
                     {reportData.patients?.patientsByAge?.map((age, index) => (
                        <div key={index}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <Text>{age.range} سنة</Text>
                              <Text strong>{age.count} مريض ({age.percentage}%)</Text>
                           </div>
                           <Progress percent={age.percentage} showInfo={false} />
                        </div>
                     ))}
                  </Space>
               </Card>
            </Col>
            <Col xs={24} lg={12}>
               <Card title="أفضل المرضى" className="clinic-card">
                  <List
                     dataSource={reportData.patients?.topPatients}
                     renderItem={(patient, index) => (
                        <List.Item>
                           <List.Item.Meta
                              avatar={
                                 <Avatar style={{ 
                                    backgroundColor: index === 0 ? 'var(--success-color)' : 
                                                   index === 1 ? 'var(--warning-color)' : 'var(--info-color)' 
                                 }}>
                                    {index + 1}
                                 </Avatar>
                              }
                              title={patient.name}
                              description={`${patient.visits} زيارات • ${patient.spent.toLocaleString()} ريال`}
                           />
                        </List.Item>
                     )}
                  />
               </Card>
            </Col>
         </Row>
      </div>
   );

   // Treatments Report Content
   const TreatmentsReport = () => (
      <div>
         <Row gutter={[24, 24]} style={{ marginBottom: 'var(--spacing-6)' }}>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="إجمالي العلاجات"
                     value={reportData.treatments?.totalTreatments}
                     prefix={<MedicineBoxOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="علاجات مكتملة"
                     value={reportData.treatments?.completedTreatments}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="معدل النجاح"
                     value={reportData.treatments?.successRate}
                     prefix={<TrophyOutlined style={{ color: 'var(--info-color)' }} />}
                     suffix="%"
                     valueStyle={{ color: 'var(--info-color)' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title="متوسط وقت العلاج"
                     value={reportData.treatments?.avgTreatmentTime}
                     prefix={<ClockCircleOutlined style={{ color: 'var(--warning-color)' }} />}
                     suffix="دقيقة"
                     valueStyle={{ color: 'var(--warning-color)' }}
                  />
               </Card>
            </Col>
         </Row>

         <Row gutter={[24, 24]}>
            <Col xs={24}>
               <Card title="أنواع العلاجات والإيرادات" className="clinic-card">
                  <Table
                     dataSource={reportData.treatments?.treatmentTypes}
                     pagination={false}
                     size="small"
                     columns={[
                        {
                           title: 'نوع العلاج',
                           dataIndex: 'type',
                           key: 'type',
                           render: (type) => <Text strong>{type}</Text>
                        },
                        {
                           title: 'العدد',
                           dataIndex: 'count',
                           key: 'count',
                           render: (count) => <Badge count={count} showZero color="blue" />
                        },
                        {
                           title: 'الإيرادات',
                           dataIndex: 'revenue',
                           key: 'revenue',
                           render: (revenue) => (
                              <Text style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                                 {revenue.toLocaleString()} ريال
                              </Text>
                           )
                        },
                        {
                           title: 'متوسط السعر',
                           key: 'average',
                           render: (_, record) => (
                              <Text>{Math.round(record.revenue / record.count).toLocaleString()} ريال</Text>
                           )
                        }
                     ]}
                  />
               </Card>
            </Col>
         </Row>
      </div>
   );

   return (
      <Content style={{ padding: 'var(--spacing-6)' }}>
         {/* Header Section */}
         <Card className="clinic-card" style={{ 
            marginBottom: 'var(--spacing-6)', 
            background: 'linear-gradient(135deg, var(--info-color) 0%, var(--primary-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <BarChartOutlined style={{ marginLeft: 12 }} />
                        التقارير والتحليلات
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        تحليل شامل للأداء المالي والتشغيلي للعيادة
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث البيانات">
                        <Button 
                           icon={<ReloadOutlined />}
                           loading={loading}
                           onClick={generateReport}
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
                     <Tooltip title="طباعة التقرير">
                        <Button 
                           icon={<PrinterOutlined />}
                           size="large"
                           onClick={handlePrint}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           طباعة
                        </Button>
                     </Tooltip>
                     <Tooltip title="تحميل PDF">
                        <Button 
                           icon={<DownloadOutlined />}
                           size="large"
                           onClick={handleExportPDF}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           تحميل PDF
                        </Button>
                     </Tooltip>
                  </Space>
               </Col>
            </Row>
         </Card>

         {/* Filters Section */}
         <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Row gutter={[16, 16]} align="middle">
               <Col xs={24} sm={8}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                     <Text strong>فترة التقرير:</Text>
                     <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                     />
                  </Space>
               </Col>
               <Col xs={24} sm={8}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                     <Text strong>نوع التقرير:</Text>
                     <Radio.Group
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        buttonStyle="solid"
                        style={{ width: '100%' }}
                     >
                        <Radio.Button value="overview">شامل</Radio.Button>
                        <Radio.Button value="detailed">تفصيلي</Radio.Button>
                        <Radio.Button value="summary">ملخص</Radio.Button>
                     </Radio.Group>
                  </Space>
               </Col>
               <Col xs={24} sm={8}>
                  <Alert
                     message={
                        <Space>
                           <CalendarOutlined />
                           <Text>التقرير يغطي فترة {dateRange[1]?.diff(dateRange[0], 'days')} يوم</Text>
                        </Space>
                     }
                     type="info"
                     showIcon={false}
                  />
               </Col>
            </Row>
         </Card>

         {/* Main Content */}
         <Card className="clinic-card">
            <Tabs
               activeKey={activeTab}
               onChange={setActiveTab}
               size="large"
               items={[
                  {
                     key: 'financial',
                     label: (
                        <span>
                           <DollarOutlined />
                           التقارير المالية
                        </span>
                     ),
                     children: <FinancialReport />
                  },
                  {
                     key: 'patients',
                     label: (
                        <span>
                           <UserOutlined />
                           تقارير المرضى
                        </span>
                     ),
                     children: <PatientsReport />
                  },
                  {
                     key: 'treatments',
                     label: (
                        <span>
                           <MedicineBoxOutlined />
                           تقارير العلاجات
                        </span>
                     ),
                     children: <TreatmentsReport />
                  },
                  {
                     key: 'performance',
                     label: (
                        <span>
                           <LineChartOutlined />
                           تقارير الأداء
                        </span>
                     ),
                     children: (
                        <div style={{ padding: 60, textAlign: 'center' }}>
                           <Empty 
                              description="تقارير الأداء قيد التطوير"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                           />
                        </div>
                     )
                  }
               ]}
            />
         </Card>

         {/* Summary Card */}
         <Card 
            className="clinic-card" 
            style={{ 
               marginTop: 'var(--spacing-6)',
               background: 'var(--bg-secondary)',
               textAlign: 'center'
            }}
         >
            <Space direction="vertical" size="middle">
               <Title level={4} style={{ color: 'var(--text-primary)' }}>
                  ملخص التقرير
               </Title>
               <Text type="secondary">
                  تم إنشاء هذا التقرير في {moment().format('DD/MM/YYYY - HH:mm')}
               </Text>
               <Text type="secondary">
                  يغطي الفترة من {dateRange[0]?.format('DD/MM/YYYY')} إلى {dateRange[1]?.format('DD/MM/YYYY')}
               </Text>
               <Divider />
               <Text>
                 🏥 نظام إدارة العيادة الشامل - تقرير {reportType === 'overview' ? 'شامل' : reportType === 'detailed' ? 'تفصيلي' : 'ملخص'}
               </Text>
            </Space>
         </Card>
      </Content>
   );
};

export default Reports;
