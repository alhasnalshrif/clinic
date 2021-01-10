import React, { useState } from 'react';
import { Divider, Timeline, Popover, Drawer, } from 'antd';
import moment from 'moment';

function AppointmentsPopoverDrawer(props) {

   const [state, setState] = useState({
      visible: false, childrenDrawer: false, visiblePopover: false
   });

   console.log(props.appointments)

   const showDrawer = () => {
      setState({
         visible: true,
         visiblePopover: false
      });
   };

   const onClose = () => {
      setState({
         visible: false,
         visiblePopover: false
      });
   };

   // const showChildrenDrawer = () => {

   //    setState({
   //       childrenDrawer: true,
   //    });
   // };

   // const onChildrenDrawerClose = () => {
   //    setState({
   //       childrenDrawer: false,
   //    });
   // };

   const handleVisiblePopoverChange = (visible) => {
      setState({ visiblePopover: visible });
   }


   return (
      <React.Fragment>

         <Popover
            title={props.title}
            trigger="click"
            visible={state.visiblePopover}
            onVisibleChange={handleVisiblePopoverChange}
            content={<a onClick={showDrawer}>View Appointments</a>}
         >
            {props.children}
         </Popover>

         <Drawer
            title="Appointments for this date"
            width="450px"
            closable={true}
            onClose={onClose}
            visible={state.visible}
         >
            <Timeline>
               {
                  props.appointments.map((appointment) => {


                     return (
                        <Timeline.Item key={appointment.id}>
                           {appointment.patient.name} @ {moment(appointment.time).format('h:mm A')} <Divider type="vertical" /> {appointment.reason}
                        </Timeline.Item>
                     );
                  })
               }
            </Timeline>

            {/* SECOND LEVEL DAWER*/}
            {/* <Button type="primary" onClick={showChildrenDrawer}>
                  Two-level drawer
               </Button>
               <Drawer
                  title="Two-level Drawer"
                  width={320}
                  closable={true}
                  onClose={onChildrenDrawerClose}
                  visible={state.childrenDrawer}
               >
                  This is two-level drawer
               </Drawer> */}
            {/* SECOND LEVEL DAWER*/}


         </Drawer>
      </React.Fragment>
   );

}


export default AppointmentsPopoverDrawer;