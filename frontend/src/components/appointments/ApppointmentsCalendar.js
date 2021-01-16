import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, BackTop, Calendar, Row, Col, Alert } from 'antd'
import AppointmentsPopoverDrawer from './AppointmentsPopoverDrawer';
import moment from 'moment';
import { connect } from "react-redux";

import { getABNTs } from "../../redux";

const { Text } = Typography;

function AppointmentsCalendar(props) {

   const [state, setState] = useState({
      value: moment(Date.now()),
      visiblePopover: false,
   });




   const getAppointmentCount = (value) => {
      const dateValue = moment(value.format('yyyy MMMM DD')).unix('X');
      return props.appointments.filter((appointment) => {
         return dateValue === moment(moment(appointment.date).format('yyyy MMMM DD')).unix('X');
      }).length;
   }

   const getAppointmentMonthCount = (value) => {
      const dateValue = moment(value.format('MMMM YYYY')).unix('X');
      return props.appointments.filter((appointment) => {
         return dateValue === moment(moment(appointment.date).format('MMMM YYYY')).unix('X');
      }).length;
   }

   const getAppointmentsDay = (value) => {
      const dateValue = moment(value.format('MMMM DD')).unix('X');
      return props.appointments.filter((appointment) => {
         return dateValue === moment(moment(appointment.date).format('MMMM DD')).unix('X');
      });
   }


   const dateFullCellRender = (date) => {

      const appointmentCount = getAppointmentCount(date);
      const startOfMonth = moment(JSON.parse(JSON.stringify(state.value))).startOf('month').unix('X');
      const endOfMonth = moment(JSON.parse(JSON.stringify(state.value))).endOf('month').unix('X');
      const isSelected = date.unix('X') === state.value.unix('X');

      if (date.unix('X') < startOfMonth || date.unix('X') > endOfMonth) {
         return (
            <div style={{ padding: 4, opacity: 0.5 }}>
               <Card
                  title={<Text>{date.format('MMMM DD')}</Text>}
                  size="small"
                  style={{ textAlign: 'right', height: 100, cursor: 'pointer', border: 0, boxShadow: '3px 3px 6px -4px #8c8c8c' }}
               >
                  {
                     appointmentCount > 0 ? (
                        <Tag color="red">{appointmentCount} Appointment(s)</Tag>
                     ) : (null)
                  }
               </Card>
            </div>
         );
      }


      return (
         <div style={{ padding: 4 }}>
            <AppointmentsPopoverDrawer
               role={props.role}
               title={<Text strong>{date.format('MMMM DD')}</Text>}
               appointments={getAppointmentsDay(date)}
            >
               {
                  isSelected ? (
                     <Card
                        title={<Text>{date.format('MMMM DD')}</Text>}
                        size="small"
                        style={
                           {
                              textAlign: 'right',
                              backgroundColor: '#e6f7ff',
                              height: 100,
                              cursor: 'pointer',
                              border: 0,
                              boxShadow: '4px 4px 4px -4px #8c8c8c'
                           }
                        }
                     >

                        {
                           appointmentCount > 0 ? (
                              <Tag color="red">{appointmentCount} Appointment(s)</Tag>
                           ) : (null)
                        }

                     </Card>
                  ) : (
                        <Card
                           title={<Text>{date.format('MMMM DD')}</Text>}
                           size="small"
                           style={
                              {
                                 textAlign: 'right',
                                 height: 100,
                                 cursor: 'pointer',
                                 border: '1px solid 8c8c8c',
                                 boxShadow: '4px 4px 4px -4px #8c8c8c'
                              }
                           }
                        >
                           {
                              appointmentCount > 0 ? (
                                 <Tag style={{ textAlign: 'center' }} color="red">{appointmentCount} Appointment(s)</Tag>
                              ) : (null)
                           }
                        </Card>
                     )
               }
            </AppointmentsPopoverDrawer >

         </div>
      );

   }

   // const hidePopover = () => {
   //    setState({ visiblePopover: false });
   // }

   // const handleVisiblePopoverChange = (visible) => {
   //    setState({ visiblePopover: visible });
   // }


   const monthCellRender = (date) => {
      const appointmentCount = getAppointmentMonthCount(date);
      return (
         <Row>
            <Col align="center">
               {appointmentCount > 0 ? (
                  <Tag color="red">{appointmentCount} Appointment(s)</Tag>
               ) : (null)}
            </Col>
         </Row>
      );
   }

   const onSelect = (value) => {
      setState({
         value
      });
   }

   const onPanelChange = (value) => {
      setState({ value });
   }

   const { value } = state;
   return (
      <>
         <Row>
            <BackTop />
            <Col align="left" span={24}>
               <Text style={{ margin: '0px 12px 0px 0px' }}>(Today's Date)</Text>
               <br />
               <Text strong style={{ fontSize: '21px', margin: '0px 12px 0px 0px' }}>{moment(Date.now()).format('MMMM DD, YYYY')}</Text>
            </Col>
         </Row>
         <Alert message={`You selected date: ${value.format('MMMM DD, YYYY')}`} />

         <Calendar
            dateFullCellRender={dateFullCellRender}
            monthCellRender={monthCellRender}
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange} />

      </>
   );

}


const mapStateToProps = state => {
   return {

      appointmentes: state.Abointments.assignmentes,

   };
};


export default connect(
   // mapStateToProps,
   // { getABNTs }
)(AppointmentsCalendar);



