import React from 'react'
import PaymentsTable from '../components/payments/PaymentsTable';
import { Layout } from 'antd';


const { Content } = Layout;

function Payments(props) {

   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <PaymentsTable />
      </Content>
   );


}

export default Payments;