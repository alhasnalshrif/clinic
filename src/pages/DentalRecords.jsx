import React from 'react';
import { useParams } from 'react-router-dom';
import DentalRecord from '../components/DentalRecord/DentalRecord';
import DentalRecordsTable from '../components/DentalRecord/DentalRecordsTable';
import { Layout } from 'antd';

const { Content } = Layout;

function DentalRecords(props) {
   const { id } = useParams();

   if (id)
      return (
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <DentalRecord id={id} />
         </Content>
      );

   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <DentalRecordsTable />
      </Content>
   );
}



export default DentalRecords;