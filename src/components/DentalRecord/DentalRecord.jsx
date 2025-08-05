import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, Button, Badge, Row, Tabs, Col, Select, Typography, Table, Tag, message, Popconfirm } from 'antd';
import moment from 'moment';

import UpdateContactForm from './UpdateContactForm';
import DescriptionItem from './DescriptionItem';
import AdultTeethChart from '../dental/AdultTeethChart';
import ChildTeethChart from '../dental/ChildTeethChart';
import TreatmentsTable from '../treatment/TreatmentsTable';
import PatientCreateAppointmentModal from './PatientCreateAppointmentModal'
import UpdatePersonalInfoModal from './UpdatePersonalInfoModal';

import { connect } from "react-redux";
import { getPATNDetail } from "../../redux";
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

// Constants moved outside component for better performance
const APPOINTMENT_STATUS_COLORS = {
  confirmed: { status: 'success', color: '#73d13d', text: 'Confirmed' },
  pending: { status: 'processing', color: '#108ee9', text: 'Pending' },
  declined: { status: 'error', color: '#ff7875', text: 'Declined' },
  cancelled: { status: 'error', color: '#ff7875', text: 'Cancelled' }
};

const TEETH_LEGEND_TAGS = [
  { color: "#ffc53d", text: "فاسد" },
  { color: "#ff4d4f", text: "مفقودة" },
  { color: "#40a9ff", text: "محشو" }
];

// Memoized table columns to prevent unnecessary re-renders
const createBalancesColumns = () => [
  {
    title: <Text strong>Date Treated</Text>,
    dataIndex: 'date_treated',
    render: (text, record) => moment(record.date_treated).format('MMMM DD, YYYY')
  },
  {
    title: <Text strong>Description</Text>,
    dataIndex: 'description',
    render: (text, record) => record.description
  },
  {
    title: <Text strong>Balance</Text>,
    dataIndex: 'balance',
    render: (text, record) => (
      <Tag color="red">
        {'₱' + record.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </Tag>
    )
  }
];

const createAppointmentsColumns = (handleCancelAppointment) => [
  {
    title: <Text strong>Date and Time</Text>,
    dataIndex: 'date',
    render: (text, record) => moment(record.date).format('MMMM DD, YYYY h:mm A')
  },
  {
    title: <Text strong>Reason</Text>,
    dataIndex: 'reason',
    render: (text, record) => record.reason
  },
  {
    title: <Text strong>Status</Text>,
    dataIndex: 'status',
    render: (text, record) => {
      const statusConfig = APPOINTMENT_STATUS_COLORS[record.status] || APPOINTMENT_STATUS_COLORS.cancelled;
      return (
        <Badge 
          status={statusConfig.status} 
          text={<Text style={{ color: statusConfig.color }}>{statusConfig.text}</Text>} 
        />
      );
    }
  },
  {
    title: <Text strong>Action(s)</Text>,
    dataIndex: 'actions',
    render: (text, record) => {
      const isAppointmentPast = moment(record.date).isBefore(moment());
      const disabled = (
        record.status === 'cancelled' ||
        record.status === 'declined' ||
        (record.status === 'pending' && isAppointmentPast) ||
        (record.status === 'confirmed' && isAppointmentPast)
      );

      if (record.status === 'declined' || record.status === 'cancelled') {
        return null;
      }

      const buttonText = record.status === 'pending' 
        ? 'Cancel Appointment Request' 
        : 'Cancel Appointment';

      return (
        <Popconfirm 
          title="Are you sure?" 
          okText="Yes" 
          cancelText="No" 
          onConfirm={() => handleCancelAppointment(record.id)}
        >
          <Button disabled={disabled} type="danger">
            {buttonText}
          </Button>
        </Popconfirm>
      );
    }
  }
];



function DentalRecord(props) {
  const [selectedOption, setSelectedOption] = useState("adult");
  const [dentalRecord, setDentalRecord] = useState({});
  const [balances, setBalances] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myAppointmentsLoading, setMyAppointmentsLoading] = useState(false);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);

  // Custom hooks for API calls
  const { execute: executeCancelAppointment, loading: cancelLoading } = useApi(
    async (appointmentId) => {
      const response = await apiService.cancelAppointment(appointmentId);
      return response;
    },
    { successMessage: 'Appointment cancelled successfully' }
  );

  const { execute: executeUpdateContact, loading: updateContactLoading } = useApi(
    async (patientId, values) => {
      const response = await apiService.updatePatientContact(patientId, values);
      return response;
    },
    { successMessage: 'Contact Number Updated Successfully' }
  );

  // Load patient details on component mount
  useEffect(() => {
    if (props.id) {
      props.getPATNDetail(props.id);
    }
  }, [props.id, props.getPATNDetail]);

  // Memoized date calculations
  const dateInfo = useMemo(() => {
    if (!props.patient?.last_visit || !props.patient?.birthday) {
      return { lastVisit: 'N/A', birthday: 'N/A', age: 'N/A' };
    }

    const lastVisit = moment(props.patient.last_visit).format('MMMM DD, YYYY');
    const birthday = moment(props.patient.birthday).format('MMMM DD, YYYY');
    const age = moment().diff(props.patient.birthday, 'years');

    return { lastVisit, birthday, age };
  }, [props.patient?.last_visit, props.patient?.birthday]);

  // Optimized API calls with proper error handling
  const getDentalRecord = useCallback(async (patientId) => {
    try {
      const response = await apiService.getPatient(patientId);
      setDentalRecord(response.data.patient || {});
    } catch (error) {
      message.error('Failed to load dental record');
    }
  }, []);

  const getMyAppointments = useCallback(async (patientId) => {
    try {
      setMyAppointmentsLoading(true);
      const response = await apiService.getPatientAppointments(patientId);
      setMyAppointments(response.data.appointments || []);
    } catch (error) {
      message.error('Failed to load appointments');
    } finally {
      setTimeout(() => setMyAppointmentsLoading(false), 500); // Reduced timeout
    }
  }, []);

  const getConfirmedAppointments = useCallback(async () => {
    try {
      const response = await apiService.getAppointments();
      setConfirmedAppointments(response.data.appointments || []);
    } catch (error) {
      message.error('Failed to load confirmed appointments');
    }
  }, []);

  const handleCancelAppointment = useCallback(async (appointmentId) => {
    try {
      await executeCancelAppointment(appointmentId);
      if (props.user?.patient_id) {
        await Promise.all([
          getMyAppointments(props.user.patient_id),
          getConfirmedAppointments()
        ]);
      }
    } catch (error) {
      message.error('Failed to cancel appointment');
    }
  }, [executeCancelAppointment, getMyAppointments, getConfirmedAppointments, props.user?.patient_id]);

  const handleContactNumberUpdate = useCallback(async (values) => {
    try {
      await executeUpdateContact(props.user?.patient_id, values);
      if (props.user?.patient_id) {
        await getDentalRecord(props.user.patient_id);
      }
    } catch (error) {
      message.error('Failed to update contact number');
    }
  }, [executeUpdateContact, getDentalRecord, props.user?.patient_id]);

  // Memoized table columns
  const balancesColumns = useMemo(() => createBalancesColumns(), []);
  const appointmentsColumns = useMemo(() => createAppointmentsColumns(handleCancelAppointment), [handleCancelAppointment]);

  // Memoized patient info for better performance
  const patientInfo = useMemo(() => {
    if (!props.patient) return [];
    
    return [
      { title: "الكود", content: props.patient.id },
      { title: "الاسم", content: props.patient.name },
      { title: "اخر زياره", content: dateInfo.lastVisit },
      { title: "تاريخ الميلاد", content: dateInfo.birthday },
      { title: "العمر", content: dateInfo.age },
      { title: "العنوان", content: props.patient.address },
      { title: "المهنه", content: props.patient.occupation },
      { title: "رقم الهاتف", content: props.patient.phone }
    ];
  }, [props.patient, dateInfo]);

  // Early return if no patient data
  if (!props.patient) {
    return <div>Loading patient data...</div>;
  }

  return (
    <>
      <Row type="flex">
        {patientInfo.map((item, index) => (
          <Col key={index} span={8}>
            <DescriptionItem title={item.title} content={item.content} />
          </Col>
        ))}
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="العلاجات و / أو الإجراءات" key="1">
          <TreatmentsTable patientId={props.patient.id} />
        </TabPane>

        <TabPane tab="الاسنان" key="2">
          <Row>
            <Col align="center" span={24}>
              <Text strong>عنوان : </Text>
              <br />
              {TEETH_LEGEND_TAGS.map((tag, index) => (
                <Tag key={index} color={tag.color}>{tag.text}</Tag>
              ))}
            </Col>

            <Select
              style={{ width: 120 }}
              onChange={setSelectedOption}
              value={selectedOption}
            >
              <Option value="adult">بالغ</Option>
              <Option value="child">طفل</Option>
            </Select>

            {selectedOption === "child" ? (
              <ChildTeethChart patientId={props.patient.id} />
            ) : (
              <AdultTeethChart patientId={props.patient.id} />
            )}
          </Row>
        </TabPane>

        <TabPane tab="كشف مريض" key="3" style={{ paddingLeft: 0, paddingRight: 100, margin: 0 }}>
          <Alert 
            style={{ marginBottom: 11 }} 
            showIcon 
            message="Note: You cannot edit or update any information on your Dental Record here except your contact number. In case of inaccurate information kindly contact us or visit us." 
          />
          
          {!dentalRecord.contact_number && (
            <Alert 
              style={{ marginBottom: 11 }} 
              showIcon 
              closable 
              message="You have no provided contact number. Please, kindly provide one to be able to receive sms notifications (appointment reminder, promos, etc.)" 
              type="warning" 
            />
          )}

          <Row type="flex">
            <Col span={8}><DescriptionItem title="Code" content={dentalRecord.code} /></Col>
            <Col span={8}><DescriptionItem title="Name" content={dentalRecord.name} /></Col>
            <Col span={8}><DescriptionItem title="Last Visit" content={dateInfo.lastVisit} /></Col>
            <Col span={8}><DescriptionItem title="Birthday" content={dateInfo.birthday} /></Col>
            <Col span={8}><DescriptionItem title="Age" content={dateInfo.age} /></Col>
            <Col span={8}><DescriptionItem title="Address" content={dentalRecord.address} /></Col>
            <Col span={8}><DescriptionItem title="Occupation" content={dentalRecord.occupation} /></Col>
            <Col span={8}><DescriptionItem title="Civil Status" content={dentalRecord.civil_status} /></Col>
            <Col span={8}>
              <UpdateContactForm 
                onUpdateContactNumber={handleContactNumberUpdate} 
                contactNumber={dentalRecord.contact_number}
                loading={updateContactLoading}
              />
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="حجز" key="4">
          {!dentalRecord.contact_number && (
            <Alert 
              style={{ marginBottom: 11 }} 
              showIcon 
              closable 
              message="You have no provided contact number on your Dental Record. Please, kindly provide one to be able to receive sms notifications (appointment reminder, appointment status, etc.)" 
              type="warning" 
            />
          )}
          
          <Alert
            style={{ marginBottom: 11 }}
            showIcon
            closable
            message={
              <><Text strong>Attention!</Text> Before you make an appointment, kindly check the clinic's calendar for available time and day otherwise your appointment will be declined or ignored.</>
            }
            type="warning" 
          />

          <Row style={{ marginBottom: 12 }}>
            <Col align="right">
              <PatientCreateAppointmentModal patientId={props.patient.id} />
            </Col>
          </Row>

          <Table
            scroll={{ x: 700 }}
            locale={{ emptyText: 'No Appointments' }}
            loading={myAppointmentsLoading || cancelLoading}
            dataSource={myAppointments}
            size="medium"
            columns={appointmentsColumns}
            rowKey="id"
            pagination={{
              position: 'bottom',
              defaultCurrent: 1,
              pageSize: 8,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
            }}
          />
        </TabPane>

        <TabPane tab="الفاتوره" key="5">
          <Table
            locale={{ emptyText: 'No Balances' }}
            dataSource={balances}
            size="medium"
            columns={balancesColumns}
            rowKey="id"
            pagination={{
              position: 'bottom',
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} balances`,
              defaultCurrent: 1,
              pageSize: 8,
            }}
          />
        </TabPane>
        
        <TabPane tab="تعديل" key="6">
          <UpdatePersonalInfoModal patientId={props.patient.id} />
        </TabPane>
      </Tabs>
    </>
  );

}

const mapStateToProps = state => ({
  patient: state.patient.patientsDetail,
});

export default connect(mapStateToProps, { getPATNDetail })(DentalRecord);



