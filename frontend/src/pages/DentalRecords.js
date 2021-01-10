import React from 'react';
import DentalRecord from '../components/DentalRecord/DentalRecord';
import DentalRecordsTable from '../components/DentalRecord/DentalRecordsTable';
import { Layout } from 'antd';

const { Content } = Layout;

function DentalRecords(props) {


   // useEffect(() => {
   //    const fetchData = async () => {
   //       try {
   //          await props.getASNTSDetail(props.match.params.id);
   //       } catch (err) { }
   //    };
   //    fetchData();
   // }, []);

   const { id: match } = props.match.params;

   if (props.match.params.id)
      return (
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <DentalRecord id={match} />
         </Content>
      );

   return (
      <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
         <DentalRecordsTable />

      </Content>
   );
}



export default DentalRecords;