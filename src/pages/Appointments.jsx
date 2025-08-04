import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Col, Input, Typography, Tabs, Row, Button, Space, Card, Alert } from 'antd';
import { CalendarOutlined, TableOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Layout } from 'antd';
import { apiService } from '../services/api';
import { debounce } from '../utils/helpers';

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;




function Appointments() {
   const [appointment, setAppointment] = useState([]);
   const [filteredAppointments, setFilteredAppointments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchValue, setSearchValue] = useState('');


   useEffect(() => {
      getAppointmentsTable();
   }, [getAppointmentsTable]);





   const getAppointmentsTable = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);
         const res = await apiService.getAppointments();
         const appointmentData = res.data || [];
         setAppointment(appointmentData);
         setFilteredAppointments(appointmentData);
      } catch (error) {
         console.error('Error fetching appointments:', error);
         setError('فشل في تحميل المواعيد');
         setAppointment([]);
         setFilteredAppointments([]);
      } finally {
         setLoading(false);
      }
   }, []);



   const debouncedSearch = useMemo(
      () => debounce((value) => {
         if (!value) {
            setFilteredAppointments(appointment);
         } else {
            const filtered = appointment.filter(({ patient }) => 
               patient?.toLowerCase().includes(value.toLowerCase())
            );
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


