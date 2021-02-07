import React, { useState, useEffect } from 'react';
import { Tabs, Card, Row, Col, Layout, Typography } from 'antd';
// import VisitChart from '../components/VisitChart';
import AppointmentsTable from '../components/appointments/AppointmentsTable';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;


const { TabPane } = Tabs;

function Dashboard(props) {

   const [state, setState] = useState({
      today_total_gross_income: NaN,
      today_total_receivable: NaN,
      all_total_gross_income: NaN,
      all_total_receivable: NaN,
      loading: true
   });

   const [appointment, setAppointment] = useState();

   useEffect(() => {
      getAppointmentsTable();

   }, []);





   const getAppointmentsTable = async () => {

      const res = await axios.get(
         `${process.env.REACT_APP_API_URL}/appointments/`,

      );
      setAppointment(res.data);

   }

   // componentDidMount() {
   //    axios.get('dashboard/incomereceivable')
   //       .then((response) => {
   //          if (response.status === 200) {
   //             this.setState(response.data);
   //             setTimeout(() => {
   //                this.setState({ loading: false });
   //             }, 300);
   //          }
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //       });
   // }


   // if (this.state.loading)
   //    return (
   //       <Content style={{ background: '#FFF', margin: '24px 24px 24px 36px', padding: 21 }}>
   //          <Skeleton loading={this.state.loading} paragraph={{ rows: 14 }} active />
   //       </Content>
   //    );

   return (
      <Content style={{ margin: '24px 24px 24px 36px' }}>

         <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col span={6}>
               <Card bordered={false}>
                  <Text type="secondary">Today's Total Gross Income</Text>

                  <Title style={{ fontWeight: 'normal', margin: 0 }} level={2}> {state.today_total_gross_income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Title>
               </Card>
            </Col>
            <Col span={6}>
               <Card bordered={false}>
                  <Text type="secondary">Today's Total Receivable</Text>
                  <Title style={{ fontWeight: 'normal', margin: 0 }} level={2}> {state.today_total_receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Title>
               </Card>
            </Col>
            <Col span={6}>
               <Card bordered={false}>
                  <Text type="secondary">Total Gross Income</Text>
                  <Title style={{ fontWeight: 'normal', margin: 0 }} level={2}>{state.all_total_gross_income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Title>
               </Card>
            </Col>
            <Col span={6}>
               <Card bordered={false}>
                  <Text type="secondary">Total Receivable</Text>
                  <Title style={{ fontWeight: 'normal', margin: 0 }} level={2}> {state.all_total_receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Title>
               </Card>
            </Col>

         </Row>



         <Row className="card-container" style={{ padding: 24, background: '#fff' }}>

            <Col span={24}>

               <Tabs defaultActiveKey="1" >
                  <TabPane tab={<Text style={{ fontSize: 18 }}> الحجوزات</Text>} key="1">
                     <AppointmentsTable appointments={appointment} />
                  </TabPane>
                  
                  <TabPane tab={<Text style={{ fontSize: 18 }}> الزيارات</Text>} key="2">
                     {/* <VisitChart /> */}
                  </TabPane>


               </Tabs>
            </Col>

         </Row>

      </Content>
   );
}



export default Dashboard;