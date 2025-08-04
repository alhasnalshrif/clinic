import React, { useState, useEffect } from 'react';
import { Col, Input, Typography, Tabs, Row, Button, Space, Card } from 'antd';
import { CalendarOutlined, TableOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import { Layout } from 'antd';
import { getABNTs } from "../redux";
import { connect } from "react-redux";
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;




function Appointments(props) {

   const [appointment, setAppointment] = useState();


   useEffect(() => {
      getAppointmentsTable();

   }, []);





   const getAppointmentsTable = async () => {
      await props.getABNTs();
      setAppointment(props.appointments);
      const res = await axios.get(
         `${process.env.REACT_APP_API_URL}/appointments/`,

      );
      setAppointment(res.data);

   }

   console.log(appointment);
   console.log(props.appointments, "c");

   const handleSearch = (value) => {


      setAppointment(props.appointments.filter(({ patient }) => {
         return patient.includes(value);
      }));

   }



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
                     onChange={(e) => handleSearch(e.target.value)}
                     style={{ width: '100%' }}
                  />
               </Col>
               <Col span={8}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                     <Typography.Text style={{ color: 'var(--text-secondary)' }}>
                        إجمالي المواعيد: {appointment?.length || 0}
                     </Typography.Text>
                  </Space>
               </Col>
            </Row>
         </Card>

         <Card className="clinic-card" style={{ padding: '24px' }}>
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
                     children: <AppointmentsTable appointments={appointment} />
                  },
                  {
                     key: "2",
                     label: (
                        <span style={{ fontSize: 16, fontWeight: 500 }}>
                           <CalendarOutlined style={{ marginLeft: 8 }} />
                           عرض التقويم
                        </span>
                     ),
                     children: <AppointmentsCalendar appointments={appointment} getAppointments={getAppointmentsTable} />
                  }
               ]}
            />
         </Card>
      </Content>
   );

}



const mapStateToProps = state => {
   return {
      appointments: state.Abointments.assignmentes,
   };
};


export default connect(
   mapStateToProps,
   { getABNTs }
)(Appointments);


