import React, { useState, useEffect } from 'react';
import { Tabs, Typography, message } from 'antd';
import AppointmentsCalendar from '../components/appointments/ApppointmentsCalendar';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import { Layout } from 'antd';
import { getABNTs } from "../redux";
import { connect } from "react-redux";

const { Title } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;

function Appointments(props) {

   const [appointment, setAppointment] = useState();



   useEffect(() => {
      getAppointmentsTable();

   }, []);


   const getAppointmentsTable = async () => {

      return await props.getABNTs()
         .then(() => {
            setAppointment(props.appointments);
         });

   }


   const updateInput = async (value) => {

      const filtered = props.appointments.filter(a => {
         return a.patient.includes(value);
      });

      setAppointment(filtered);
   }

   console.log(appointment)

   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <Title level={4}>APPOINTMENTS</Title>
         <Tabs defaultActiveKey="1">
            <TabPane tab="Table View" key="1">
               <AppointmentsTable appointments={appointment} updateInput={updateInput} />
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
      // loading: state.Abointment.loading
   };
};


export default connect(
   mapStateToProps,
   { getABNTs }
)(Appointments);

