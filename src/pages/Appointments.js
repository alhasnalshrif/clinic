import React, { useState, useEffect } from 'react';
import { Tabs, Typography, message } from 'antd';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import { Layout } from 'antd';
import { getABNTs } from "../redux";
import { connect } from "react-redux";
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;




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



         <Tabs defaultActiveKey="1">
            <TabPane tab="Table View" key="1">
               <AppointmentsTable appointments={appointment} updateInput={handleSearch} />
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


