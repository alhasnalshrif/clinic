import React from 'react';
import DentalRecord from '../components/DentalRecord/DentalRecord';
import DentalRecordsTable from '../components/DentalRecord/DentalRecordsTable';
import { Layout } from 'antd';

const { Content } = Layout;

function DentalRecords(props) {


   const { code: match } = props.match.params;
   if (match)
      return (
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <DentalRecord role={props.user.role} code={match} />
         </Content>
      );
   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <DentalRecordsTable />
      </Content>
   );
}



export default DentalRecords;