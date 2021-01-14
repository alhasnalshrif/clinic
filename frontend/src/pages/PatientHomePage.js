import React, { useState } from 'react';
import { Alert, Button, Badge, Layout, Row, Tabs, Col, notification, Typography, Table, Tag, message, Popconfirm } from 'antd';
import DescriptionItem from '../components/DentalRecord/DescriptionItem';
import axios from 'axios';
import moment from 'moment';
import UpdateContactForm from '../components/UpdateContactForm';
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

   const handleCreate = (values) => {
      const hide = message.loading('Creating New Dental Record...', 0);
      values.birthday = values.birthday.format('YYYY-MM-DD');
      axios.post('patients/create', values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('New Dental Record Created Successfully');
               // getPatients();
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });
   }

   // componentDidMount() {
   //    getDentalRecord(props.user.patient_id);
   //    getMyBalances(props.user.patient_id);
   //    getMyAppointments(props.user.patient_id);
   //    getConfirmedAppointments();
   // }

   const getDentalRecord = (patientId) => {
      axios.post(`/api/patients/${patientId}`)
         .then((response) => {
            if (response.status === 200)
               setState({ dentalRecord: response.data.patient });
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const getMyBalances = (patientId) => {
      axios.get(`/api/patients/${patientId}/myBalances`)
         .then((response) => {
            if (response.status === 200)
               setState({ balances: response.data.balances });
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const getMyAppointments = (patientId) => {
      setState({ myAppointmentsLoading: true });
      axios.get(`/api/patients/${patientId}/myAppointments`)
         .then((response) => {
            if (response.status === 200) {
               setState({ myAppointments: response.data.appointments });
               setTimeout(() => {
                  setState({ myAppointmentsLoading: false });
               }, 800);
            }
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const getConfirmedAppointments = () => {
      axios.get(`/api/appointments`)
         .then((response) => {
            if (response.status === 200) {
               setState({ confirmedAppointments: response.data.appointments });

            }
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }



   const handleCancelAppointment = (appointmentId) => {
      axios.post(`/api/patients/${appointmentId}/cancelAppointment`)
         .then((response) => {
            if (response.status === 200) {
               getMyAppointments(props.user.patient_id)
               getConfirmedAppointments();
            }
         })
         .catch((err) => {
            console.log(err);
            message.error('Something went wrong! Please, try again.');
         });
   }

   const handleContactNumberUpdate = (values) => {
      const hide = message.loading('Updating Contact Number...', 0);
      axios.post(`/api/patients/${props.user.patient_id}/updateContactNumber`, values)
         .then((response) => {
            if (response.status === 200) {
               hide();
               message.success('Contact Number Updated Successfully');
               getDentalRecord(props.user.patient_id);
            }
         })
         .catch((err) => {
            console.log(err);
            hide();
            message.error('Something went wrong! Please, try again.');
         });
   }


   const balancesColumns = [
      {
         title: <Text strong>Date Treated</Text>,
         dataIndex: 'date_treated',
         render: (text, record) => {
            return moment(record.date_treated).format('MMMM DD, YYYY');
         }
      },
      {
         title: <Text strong>Description</Text>,
         dataIndex: 'description',
         render: (text, record) => {
            return record.description;
         }
      },
      {
         title: <Text strong>Balance</Text>,
         dataIndex: 'balance',
         render: (text, record) => {
            return <Tag color="red">{'₱' + record.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Tag>;
         }
      }
   ];

   const appointmentsColumns = [
      {
         title: <Text strong>Date and Time</Text>,
         dataIndex: 'date',
         render: (text, record) => {
            return moment(record.date).format('MMMM DD, YYYY h:mm A');
         }
      },
      {
         title: <Text strong>Reason</Text>,
         dataIndex: 'reason',
         render: (text, record) => {
            return record.reason;
         }
      },
      {
         title: <Text strong>Status</Text>,
         dataIndex: 'status',
         render: (text, record) => {
            return record.status === 'confirmed' ? (<Badge status="success" text={<Text style={{ color: '#73d13d' }}>Confirmed</Text>} />)
               : record.status === 'pending' ? (
                  <Badge status="processing" text={<Text style={{ color: '#108ee9' }}>Pending</Text>} />
               )
                  : record.status === 'declined' ? (
                     (<Badge status="error" text={<Text style={{ color: '#ff7875' }}>Declined</Text>} />)
                  )
                     : (<Badge status="error" text={<Text style={{ color: '#ff7875' }}>Cancelled</Text>} />)
         }
      },
      {
         title: <Text strong>Action(s)</Text>,
         dataIndex: 'actions',
         render: (text, record) => {
            const isAppointmentPast = moment(record.date).format('X') < moment(Date.now()).format('X');
            const disabled = (record.status === 'cancelled'
               || record.status === 'declined'
               || (record.status === 'pending' && isAppointmentPast)
               || (record.status === 'confirmed' && isAppointmentPast)
            ) ? true : false;

            const cancelDeclineButton = record.status === 'pending' ? (
               <Popconfirm title="Are you sure?" okText="Yes" cancelText="No" onConfirm={() => handleCancelAppointment(record.id)}>
                  <Button disabled={disabled} type="danger">
                     Cancel Appointment Request
                     </Button>
               </Popconfirm>

            ) : (
                  <Popconfirm title="Are you sure?" okText="Yes" cancelText="No" onConfirm={() => handleCancelAppointment(record.id)}>
                     <Button disabled={disabled} type="danger">
                        Cancel Appointment
                  </Button>
                  </Popconfirm>
               );

            if (record.status === 'declined' || record.status === 'cancelled')
               return null;

            return cancelDeclineButton;
         }
      }
   ];
   const lastVisit = moment(state.dentalRecord.last_visit).format('MMMM DD, YYYY');
   const birthday = moment(state.dentalRecord.birthday).format('MMMM DD, YYYY');
   const age = moment().diff(state.dentalRecord.birthday, 'years');

   return (
      <>
         <Content style={{ margin: '24px 24px 24px 36px', padding: 24, background: '#fff' }}>
            <Title level={4}>الاستقبال</Title>

            <Tabs tabPosition="top" >

               <TabPane tab="كشف مريض" key="1" style={{ paddingLeft: 0, paddingRight: 100, margin: 0 }}>

                  <Alert style={{ marginBottom: 11 }} showIcon message="Note: You cannot edit or update any information on your Dental Record here except your contact number. In case of inaccurate information kindly contact us or visit us." />
                  {!state.dentalRecord.contact_number ? (
                     <Alert style={{ marginBottom: 11 }} showIcon closable message="You have no provided contact number. Please, kindly provide one to be able to receive sms notifications (appointment reminder, promos, etc.)" type="warning" />
                  ) : null}

                  <Col align="right" style={{ marginBottom: '8px' }}>
                     <CreateDentalRecordModal onCreate={handleCreate} />
                  </Col>

                  <Row type="flex">
                     <Col span={8}><DescriptionItem title="Code" content={state.dentalRecord.code} /></Col>
                     <Col span={8}><DescriptionItem title="Name" content={state.dentalRecord.name} /></Col>
                     <Col span={8}><DescriptionItem title="Last Visit" content={lastVisit} /></Col>
                     <Col span={8}><DescriptionItem title="Birthday" content={birthday} /></Col>
                     <Col span={8}><DescriptionItem title="Age" content={age} /></Col>
                     <Col span={8}><DescriptionItem title="Address" content={state.dentalRecord.address} /></Col>
                     <Col span={8}><DescriptionItem title="Occupation" content={state.dentalRecord.occupation} /></Col>
                     <Col span={8}><DescriptionItem title="Civil Status" content={state.dentalRecord.civil_status} /></Col>
                     <Col span={8}>
                        <UpdateContactForm onUpdateContactNumber={handleContactNumberUpdate} contactNumber={state.dentalRecord.contact_number} />
                     </Col>
                  </Row>
               </TabPane>

               <TabPane tab="حجز" key="2">

                  {!state.dentalRecord.contact_number ? (
                     <Alert style={{ marginBottom: 11 }} showIcon closable message="You have no provided contact number on your Dental Record. Please, kindly provide one to be able to receive sms notifications (appointment reminder, appointment status, etc.)" type="warning" />
                  ) : null}
                  <Alert
                     style={{ marginBottom: 11 }}
                     showIcon
                     closable
                     message={
                        (<><Text strong>Attention!</Text> Before you make an appoinment, kindly check the clinic's calendar for available time and day otherwise your appointment will be declined or ignored.</>)
                     }
                     type="warning" />
                  <Row style={{ marginBottom: 12 }}>
                     <Col align="right">
                        {/* <PatientCreateAppointmentModal onCreate={handleCreateAppointment} patientId={props.user.patient_id} /> */}
                     </Col>
                  </Row>
                  <Col style={{ marginBottom: 8 }} align="right">
                     <CreateAppointmentModal />
                  </Col>
                  <Table
                     scroll={{ x: 700 }}
                     locale={{ emptyText: 'No Appointments' }}
                     loading={state.myAppointmentsLoading}
                     dataSource={state.myAppointments}
                     size="medium"
                     columns={appointmentsColumns}
                     rowKey={(record) => record.id}
                     pagination={
                        {
                           position: 'bottom',
                           defaultCurrent: 1,
                           pageSize: 8,
                           showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
                           onChange: (page, pageSize) => {

                           }
                        }
                     }
                  />
               </TabPane>

               <TabPane tab="الفاتوره" key="3">

                  <Table
                     locale={{ emptyText: 'No Balances' }}
                     dataSource={state.balances}
                     size="medium"
                     columns={balancesColumns}
                     rowKey={(record) => record.id}
                     pagination={
                        {
                           position: 'bottom',
                           showSizeChanger: true,
                           showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} balances`,
                           defaultCurrent: 1,
                           pageSize: 8,
                           onChange: (page, pageSize) => {

                           }
                        }
                     }
                  />
               </TabPane>





            </Tabs>

         </Content>
      </>
   );
}

export default PatientHomePage;