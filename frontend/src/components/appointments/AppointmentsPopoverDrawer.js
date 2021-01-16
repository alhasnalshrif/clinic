import React, { useState } from 'react';
import { Divider, Timeline, Popover, Drawer, } from 'antd';

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
                           {appointment.patient} @ {appointment.time} <Divider type="vertical" /> {appointment.reason}
                        </Timeline.Item>
                     );
                  })
               }
            </Timeline>



         </Drawer>
      </React.Fragment>
   );

}


export default AppointmentsPopoverDrawer;