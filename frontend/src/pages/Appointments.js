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


   const [state, setState] = useState({
      appointmentsTableLoading: true,
      appointmentsTable: []
   });

   // console.log(state)

   useEffect(() => {
      getAppointmentsTable()

   }, []);


   const getAppointmentsTable = async () => {

      props.getABNTs()

   }

   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <Title level={4}>APPOINTMENTS</Title>
         <Tabs defaultActiveKey="1">
            <TabPane tab="Table View" key="1">
               <AppointmentsTable appointments={props.appointment} />
            </TabPane>
            <TabPane tab="Calendar View" key="2">
               <AppointmentsCalendar appointments={props.appointment} getAppointments={getAppointmentsTable} />
            </TabPane>
         </Tabs>
      </Content>
   );

}



const mapStateToProps = state => {
   return {

      appointment: state.Abointments.assignmentes,
      // loading: state.Abointment.loading
   };
};


export default connect(
   mapStateToProps,
   { getABNTs }
)(Appointments);


{/* <AppointmentsCalendar appointments={state.appointmentsTable} /> */ }
{/* <AppointmentsTable tableLoading={state.appointmentsTableLoading} appointments={state.appointmentsTable} getAppointments={props.appointment} /> */ }
