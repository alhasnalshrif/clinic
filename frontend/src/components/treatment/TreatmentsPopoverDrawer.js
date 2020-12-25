import React, { useState } from 'react';
import { Timeline, Popover, Drawer, Divider } from 'antd';
import moment from 'moment';


const TreatmentsPopoverDrawer = (props) => {

   const [visible, setVisible] = useState(false);
   const [visiblePopover, setVisiblePopover] = useState(false);
   // const [childrenDrawer, setChildrenDrawer] = useState(false);

   const showDrawer = () => {
      props.getTreatments();

      setVisible(true);
      setVisiblePopover(false);
   };
   const onClose = () => {
      setVisible(false);
      setVisiblePopover(false);

   };

   // const showChildrenDrawer = () => {
   //    setChildrenDrawer(true);
   // };

   // const onChildrenDrawerClose = () => {
   //    setChildrenDrawer(false);
   // };

   const handleVisiblePopoverChange = (visible) => {
      setVisiblePopover(visible);
   }
   console.log(props.treatments)
   return (
      <React.Fragment>
         <Popover
            title={props.title}
            trigger="click"
            visible={visiblePopover}
            onVisibleChange={handleVisiblePopoverChange}
            content={(
               <React.Fragment>
                  {props.content}
                  <br />
                  <button style={{ textAlign: 'center', display: 'block', marginTop: 8 }} onClick={showDrawer}>View Treatments</button>
               </React.Fragment>
            )}
         >
            {props.children}
         </Popover>

         <Drawer
            title="Treatments done on this tooth"
            width="450px"
            closable={true}
            onClose={onClose}
            visible={visible}
         >

            <Timeline>
               {
                  props.treatments.map((treatment) => (
                     <Timeline.Item key={treatment.id}>{moment(treatment.date_treated).format('MMMM DD, YYYY')}<Divider type="vertical" />{treatment.description}</Timeline.Item>
                  ))
               }
            </Timeline>
         </Drawer>
      </React.Fragment>
   );
}

export default TreatmentsPopoverDrawer;