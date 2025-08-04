import React from 'react';
import { Layout, Tabs, Col, Typography } from 'antd';

import CreateDentalRecord from '../components/reception/CreateDentalRecord'
import CreateAppointment from '../components/reception/CreateAppointment';
import CreatePayment from '../components/reception/CreatePayment';

const { Title } = Typography;
const { Content } = Layout;

function Reception(props) {

   return (
      <>
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <Title level={4}>الاستقبال</Title>

            <Tabs 
               tabPosition="top"
               items={[
                  {
                     key: "1",
                     label: "كشف مريض",
                     children: (
                        <Col align="right" style={{ marginBottom: '8px' }}>
                           <CreateDentalRecord />
                        </Col>
                     )
                  },
                  {
                     key: "2", 
                     label: "حجز",
                     children: (
                        <Col style={{ marginBottom: 8 }} align="right">
                           <CreateAppointment />
                        </Col>
                     )
                  },
                  {
                     key: "3",
                     label: "الفاتوره", 
                     children: <CreatePayment />
                  }
               ]}
            />

         </Content>
      </>
   );
}

export default Reception;