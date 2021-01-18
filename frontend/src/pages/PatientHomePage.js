import React, { useState } from 'react';
import { Alert, Button, Badge, Layout, Row, Tabs, Col, notification, Typography, Table, Tag, message, Popconfirm } from 'antd';
import DescriptionItem from '../components/DentalRecord/DescriptionItem';
import axios from 'axios';
import moment from 'moment';
import CreateDentalRecordModal from '../components/dental/CreateDentalRecordModal'
import CreateAppointmentModal from '../components/appointments/CreateAppointmentModal';

const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { Content } = Layout;

function PatientHomePage(props) {


   const [state, setState] = useState({
      dentalRecord: {},
      balances: [],
      myAppointments: [],
      myAppointmentsLoading: false,
      confirmedAppointments: []
   });


   return (
      <>
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <Title level={4}>الاستقبال</Title>

            <Tabs tabPosition="top" >

               <TabPane tab="كشف مريض" key="1" style={{ paddingLeft: 0, paddingRight: 100, margin: 0 }}>

               

                  <Col align="right" style={{ marginBottom: '8px' }}>
                     <CreateDentalRecordModal  />
                     {/* <CreateDentalRecordModal onCreate={handleCreate} /> */}
                  </Col>

               </TabPane>

               <TabPane tab="حجز" key="2">

                  <Col style={{ marginBottom: 8 }} align="right">
                     <CreateAppointmentModal />
                  </Col>
                
               </TabPane>

               <TabPane tab="الفاتوره" key="3">

                 
               </TabPane>





            </Tabs>

         </Content>
      </>
   );
}

export default PatientHomePage;