import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Col, 
  Input, 
  Typography, 
  Tabs, 
  Row, 
  Button, 
  Space, 
  Card, 
  Alert,
  Empty,
  message,
  DatePicker,
  Select,
  Statistic,
  Badge,
  Divider,
  Tooltip
} from 'antd';
import { 
  CalendarOutlined, 
  TableOutlined, 
  PlusOutlined, 
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Layout } from 'antd';
import { apiService } from '../services/api';
import { debounce } from '../utils/helpers';
import moment from 'moment';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

function Appointments() {
   const [appointment, setAppointment] = useState([]);
   const [filteredAppointments, setFilteredAppointments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchValue, setSearchValue] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [dateRange, setDateRange] = useState([]);
   const [activeTab, setActiveTab] = useState('table');

   const getAppointmentsTable = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);
         const res = await apiService.getAppointments();
         const appointmentData = res.data || [];
         setAppointment(appointmentData);
         setFilteredAppointments(appointmentData);
         message.success('تم تحميل المواعيد بنجاح');
      } catch (error) {
         console.error('Error fetching appointments:', error);
         setError('فشل في تحميل المواعيد. يرجى المحاولة مرة أخرى.');
         message.error('فشل في تحميل المواعيد');
         setAppointment([]);
         setFilteredAppointments([]);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      getAppointmentsTable();
   }, [getAppointmentsTable]);

   // Filter appointments based on search, status, and date range
   const filterAppointments = useCallback((appointments, search, status, dates) => {
      let filtered = [...appointments];

      // Search filter
      if (search) {
         filtered = filtered.filter(apt => 
            apt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
            apt.reason?.toLowerCase().includes(search.toLowerCase()) ||
            apt.patient?.phone?.includes(search)
         );
      }

      // Status filter
      if (status && status !== 'all') {
         filtered = filtered.filter(apt => apt.status === status);
      }

      // Date range filter
      if (dates && dates.length === 2) {
         const [startDate, endDate] = dates;
         filtered = filtered.filter(apt => {
            const aptDate = moment(apt.date);
            return aptDate.isBetween(startDate, endDate, 'day', '[]');
         });
      }

      return filtered;
   }, []);

   const debouncedSearch = useMemo(
      () => debounce((value, status, dates) => {
         const filtered = filterAppointments(appointment, value, status, dates);
         setFilteredAppointments(filtered);
      }, 300),
      [appointment, filterAppointments]
   );

   useEffect(() => {
      debouncedSearch(searchValue, statusFilter, dateRange);
   }, [searchValue, statusFilter, dateRange, debouncedSearch]);

   const handleSearch = (value) => {
      setSearchValue(value);
   };

   const handleStatusFilter = (value) => {
      setStatusFilter(value);
   };

   const handleDateRangeChange = (dates) => {
      setDateRange(dates);
   };

   const handleRefresh = () => {
      getAppointmentsTable();
   };

   const handleClearFilters = () => {
      setSearchValue('');
      setStatusFilter('all');
      setDateRange([]);
      setFilteredAppointments(appointment);
   };

   // Calculate statistics
   const appointmentStats = useMemo(() => {
      const total = appointment.length;
      const today = moment().format('YYYY-MM-DD');
      const todayAppointments = appointment.filter(apt => apt.date === today);
      const pending = appointment.filter(apt => apt.status === 'pending' || apt.status === 'في الانتظار');
      const completed = appointment.filter(apt => apt.status === 'completed');
      const cancelled = appointment.filter(apt => apt.status === 'cancelled');

      return {
         total,
         todayCount: todayAppointments.length,
         pending: pending.length,
         completed: completed.length,
         cancelled: cancelled.length,
         completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0
      };
   }, [appointment]);

   if (loading && appointment.length === 0) {
      return (
         <Content style={{ padding: 'var(--spacing-6)' }}>
            <LoadingSkeleton />
         </Content>
      );
   }

   return (
      <Content style={{ padding: 'var(--spacing-6)' }}>
         {/* Header Section */}
         <Card className="clinic-card" style={{ 
            marginBottom: 'var(--spacing-6)', 
            background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--info-color) 100%)', 
            border: 'none',
            color: 'white'
         }}>
            <Row justify="space-between" align="middle">
               <Col>
                  <Space direction="vertical" size="small">
                     <Title level={2} style={{ margin: 0, color: 'white' }}>
                        <CalendarOutlined style={{ marginLeft: 12 }} />
                        إدارة المواعيد
                     </Title>
                     <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 'var(--text-base)' }}>
                        إدارة وتتبع جميع مواعيد المرضى في العيادة
                     </Text>
                  </Space>
               </Col>
               <Col>
                  <Space size="middle">
                     <Tooltip title="تحديث القائمة">
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
                     <Tooltip title="إضافة موعد جديد">
                        <Button 
                           type="default"
                           icon={<PlusOutlined />}
                           size="large"
                           onClick={() => message.info('سيتم إضافة هذه الميزة قريباً')}
                           style={{ 
                              background: 'rgba(255, 255, 255, 0.2)', 
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'white'
                           }}
                        >
                           موعد جديد
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
                     title={<span style={{ color: 'var(--text-secondary)' }}>إجمالي المواعيد</span>}
                     value={appointmentStats.total}
                     prefix={<CalendarOutlined style={{ color: 'var(--primary-color)' }} />}
                     valueStyle={{ color: 'var(--primary-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>مواعيد اليوم</span>}
                     value={appointmentStats.todayCount}
                     prefix={<ClockCircleOutlined style={{ color: 'var(--info-color)' }} />}
                     valueStyle={{ color: 'var(--info-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>في الانتظار</span>}
                     value={appointmentStats.pending}
                     prefix={
                        <Badge count={appointmentStats.pending} size="small">
                           <WarningOutlined style={{ color: 'var(--warning-color)' }} />
                        </Badge>
                     }
                     valueStyle={{ color: 'var(--warning-color)', fontSize: '28px', fontWeight: 'bold' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
               <Card className="clinic-card">
                  <Statistic
                     title={<span style={{ color: 'var(--text-secondary)' }}>مكتملة</span>}
                     value={appointmentStats.completed}
                     prefix={<CheckCircleOutlined style={{ color: 'var(--success-color)' }} />}
                     valueStyle={{ color: 'var(--success-color)', fontSize: '28px', fontWeight: 'bold' }}
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

         {/* Filters Section */}
         <Card className="clinic-card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Row gutter={[16, 16]} align="middle">
               <Col xs={24} sm={8}>
                  <Search
                     placeholder="البحث في المواعيد (اسم المريض، سبب الزيارة، رقم الهاتف)"
                     value={searchValue}
                     onChange={(e) => handleSearch(e.target.value)}
                     style={{ width: '100%' }}
                     allowClear
                     prefix={<SearchOutlined />}
                  />
               </Col>
               <Col xs={24} sm={4}>
                  <Select
                     placeholder="حالة الموعد"
                     value={statusFilter}
                     onChange={handleStatusFilter}
                     style={{ width: '100%' }}
                     suffixIcon={<FilterOutlined />}
                  >
                     <Option value="all">جميع الحالات</Option>
                     <Option value="pending">في الانتظار</Option>
                     <Option value="confirmed">مؤكد</Option>
                     <Option value="completed">مكتمل</Option>
                     <Option value="cancelled">ملغى</Option>
                  </Select>
               </Col>
               <Col xs={24} sm={6}>
                  <RangePicker
                     placeholder={['تاريخ البداية', 'تاريخ النهاية']}
                     value={dateRange}
                     onChange={handleDateRangeChange}
                     style={{ width: '100%' }}
                     format="DD/MM/YYYY"
                  />
               </Col>
               <Col xs={24} sm={6}>
                  <Space>
                     <Button 
                        onClick={handleClearFilters}
                        disabled={!searchValue && statusFilter === 'all' && dateRange.length === 0}
                     >
                        مسح الفلاتر
                     </Button>
                     <Text type="secondary">
                        النتائج: {filteredAppointments.length} من {appointment.length}
                     </Text>
                  </Space>
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
                     key: 'table',
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <TableOutlined style={{ marginLeft: 8 }} />
                           عرض جدولي
                           <Badge count={filteredAppointments.length} size="small" style={{ marginRight: 8 }} />
                        </span>
                     ),
                     children: filteredAppointments.length > 0 ? (
                        <AppointmentsTable 
                           data={filteredAppointments} 
                           onRefresh={getAppointmentsTable}
                           loading={loading}
                        />
                     ) : (
                        <Empty
                           image={Empty.PRESENTED_IMAGE_SIMPLE}
                           description={
                              <div className="empty-state">
                                 <CalendarOutlined className="empty-state-icon" />
                                 <div className="empty-state-title">لا توجد مواعيد</div>
                                 <div className="empty-state-description">
                                    {searchValue || statusFilter !== 'all' || dateRange.length > 0
                                       ? 'لا توجد مواعيد تطابق معايير البحث'
                                       : 'لم يتم العثور على أي مواعيد مجدولة'}
                                 </div>
                                 {(!searchValue && statusFilter === 'all' && dateRange.length === 0) && (
                                    <Button 
                                       type="primary" 
                                       icon={<PlusOutlined />} 
                                       style={{ marginTop: 16 }}
                                       onClick={() => message.info('سيتم إضافة هذه الميزة قريباً')}
                                    >
                                       إضافة موعد جديد
                                    </Button>
                                 )}
                              </div>
                           }
                        />
                     )
                  },
                  {
                     key: 'calendar',
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <CalendarOutlined style={{ marginLeft: 8 }} />
                           عرض تقويم
                        </span>
                     ),
                     children: (
                        <div style={{ minHeight: 600 }}>
                           <AppointmentsCalendar appointments={filteredAppointments} />
                        </div>
                     )
                  }
               ]}
            />
         </Card>
      </Content>
   );
}

export default Appointments;
         if (!value) {
            setFilteredAppointments(appointment);
         } else {
            const filtered = appointment.filter((apt) => {
               const patientName = typeof apt.patient === 'object' ? apt.patient?.name : apt.patient;
               return patientName?.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredAppointments(filtered);
         }
      }, 300),
      [appointment]
   );

   const handleSearch = useCallback((value) => {
      setSearchValue(value);
      debouncedSearch(value);
   }, [debouncedSearch]);



   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>
         <Card className="clinic-card" style={{ marginBottom: 24, padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
               <Col>
                  <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
                     الحجوزات
                  </Title>
                  <Typography.Text style={{ color: 'var(--text-secondary)' }}>
                     إدارة مواعيد المرضى والحجوزات
                  </Typography.Text>
               </Col>
               <Col>
                  <Button 
                     type="primary" 
                     icon={<PlusOutlined />} 
                     className="clinic-btn-primary"
                     size="large"
                  >
                     إضافة موعد جديد
                  </Button>
               </Col>
            </Row>

            <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
               <Col span={16}>
                  <Search
                     size="large"
                     placeholder="البحث في المواعيد بواسطة اسم المريض..."
                     enterButton={
                        <Button className="clinic-btn-primary" icon={<SearchOutlined />}>
                           بحث
                        </Button>
                     }
                     value={searchValue}
                     onChange={(e) => handleSearch(e.target.value)}
                     style={{ width: '100%' }}
                  />
               </Col>
               <Col span={8}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                     <Typography.Text style={{ color: 'var(--text-secondary)' }}>
                        إجمالي المواعيد: {filteredAppointments?.length || 0} من أصل {appointment?.length || 0}
                     </Typography.Text>
                  </Space>
               </Col>
            </Row>
         </Card>

         {error && (
            <Alert 
               message="خطأ في تحميل البيانات" 
               description={error}
               type="error"
               showIcon
               style={{ marginBottom: 24 }}
               action={
                  <Button onClick={getAppointmentsTable} size="small">
                     إعادة المحاولة
                  </Button>
               }
            />
         )}

         <Card className="clinic-card" style={{ padding: '24px' }}>
            {loading ? (
               <LoadingSkeleton type="table" rows={6} />
            ) : (
               <Tabs 
                  defaultActiveKey="1"
                  size="large"
                  items={[
                     {
                        key: "1",
                        label: (
                           <span style={{ fontSize: 16, fontWeight: 500 }}>
                              <TableOutlined style={{ marginLeft: 8 }} />
                              عرض الجدول
                           </span>
                        ),
                        children: (
                           <AppointmentsTable 
                              appointments={filteredAppointments} 
                              onRefresh={getAppointmentsTable}
                           />
                        )
                     },
                     {
                        key: "2",
                        label: (
                           <span style={{ fontSize: 16, fontWeight: 500 }}>
                              <CalendarOutlined style={{ marginLeft: 8 }} />
                              عرض التقويم
                           </span>
                        ),
                        children: (
                           <AppointmentsCalendar 
                              appointments={filteredAppointments} 
                              getAppointments={getAppointmentsTable} 
                           />
                        )
                     }
                  ]}
               />
            )}
         </Card>
      </Content>
   );

}

export default Appointments;


