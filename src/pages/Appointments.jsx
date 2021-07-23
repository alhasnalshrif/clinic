import React, { useState, useEffect } from 'react';
import { Col, Input, Typography, Tabs, Row } from 'antd';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import { Layout } from 'antd';
import { getABNTs } from "../redux";
import { connect } from "react-redux";
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;
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
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <Title level={4}>الحجوزات</Title>

         <Row align="middle" gutter={8}>
            <Col style={{ marginBottom: 8 }} span={24}>
               <Search
                  style={{ width: '100%', zIndex: -999 }}
                  placeholder="search appointment by patient name"
                  enterButton
                  onChange={(e) => handleSearch(e.target.value)}
               />

            </Col>
         </Row>

         <Tabs defaultActiveKey="1">
            <TabPane tab="Table View" key="1">
               <AppointmentsTable appointments={appointment} />
            </TabPane>

            <TabPane tab="Calendar View" key="2">
               <AppointmentsCalendar appointments={appointment} getAppointments={getAppointmentsTable} />
            </TabPane>
         </Tabs>
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


