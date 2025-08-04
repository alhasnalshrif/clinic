import React from 'react';
import { Layout, Tabs, Col, Typography } from 'antd';

import CreateDentalRecord from '../components/reception/CreateDentalRecord'
import CreateAppointment from '../components/reception/CreateAppointment';
import CreatePayment from '../components/reception/CreatePayment';

const { Title } = Typography;
const { Content } = Layout;

function Reception(props) {


   // const [state, setState] = useState({
   //    dentalRecord: {},
   //    balances: [],
   //    myAppointments: [],
   //    myAppointmentsLoading: false,
   //    confirmedAppointments: []
   // });


   return (
      <>
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <Title level={4}>الاستقبال</Title>

            <Tabs tabPosition="top" >

               <TabPane tab="كشف مريض" key="1" style={{ paddingLeft: 0, paddingRight: 100, margin: 0 }}>



                  <Col align="right" style={{ marginBottom: '8px' }}>
                     <CreateDentalRecord />
                     {/* <CreateDentalRecordModal onCreate={handleCreate} /> */}
                  </Col>

               </TabPane>

               <TabPane tab="حجز" key="2">

                  <Col style={{ marginBottom: 8 }} align="right">
                     <CreateAppointment />
                  </Col>

               </TabPane>

               <TabPane tab="الفاتوره" key="3">

                  <CreatePayment />
               </TabPane>





            </Tabs>

         </Content>
      </>
   );
}

export default Reception;