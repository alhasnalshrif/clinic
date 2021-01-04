import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Skeleton, Row, Col, Tag, Tabs, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

import DescriptionItem from './DescriptionItem';
import AdultTeethChart from '../dental/AdultTeethChart';
import ChildTeethChart from '../dental/ChildTeethChart';

import TreatmentsTable from './TreatmentsTable';

import UpdatePersonalInfoModal from './UpdatePersonalInfoModal';

const { TabPane } = Tabs;
const { Text } = Typography;



function DentalRecord(props) {

  const [state, setState] = useState({
    loading: true,
    patient: {},
    treatments: []
  });


  // componentDidMount() {
  //   getRecord(props.code);
  // }

  const getRecord = (code) => {
    setState({ loading: true });
    axios.get(`patients/${code}`)
      .then((response) => {
        if (response.status === 200)
          setState({ patient: response.data.patient });
      })
      .then(() => {
        setTimeout(() => {
          setState({ loading: false });
        }, 800)
      })
      .catch((err) => {
        console.error(err);
        message.error('Something went wrong! Please, try again.');
      });
  }

  const getRecordOnAddTreatment = (code) => {
    axios.get(`patients/${code}`)
      .then((response) => {
        if (response.status === 200)
          setState({ patient: response.data.patient });
      })
      .catch((err) => {
        console.error(err);
        message.error('Something went wrong! Please, try again.');
      });
  }

  const handleUpdate = (code, values) => {
    const hide = message.loading('Updating Personal Info...', 0);
    values.birthday = values.birthday.format('YYYY-MM-DD');
    axios.patch(`patients/${code}/update`, values)
      .then((response) => {
        if (response.status === 200) {
          hide();
          message.success('Personal Info Updated Successfully');
          getRecord(code);
        }
      })
      .catch((err) => {
        console.log(err);
        hide();
        message.error('Something went wrong! Please, try again.');
      });
  }

  const lastVisit = !state.patient.last_visit ? (<Tag color="geekblue">New Record</Tag>) : moment(state.patient.last_visit).format('MMMM, DD YYYY');
  const birthday = moment(state.patient.birthday).format('MMMM DD, YYYY');
  const age = moment().diff(state.patient.birthday, 'years');
  return (
    <React.Fragment>
      <div style={{ marginBottom: 8 }}>
        <Row>
          <Col align="left">
            <Link to="/dentalrecords"> Back to Dental Records</Link>
          </Col>
          <Col align="right">
            <UpdatePersonalInfoModal patient={state.patient} onUpdate={handleUpdate} />
          </Col>
        </Row>
      </div>
      {state.loading ? (<Skeleton loading={state.loading} paragraph={{ rows: 14 }} active />) : (
        <React.Fragment>
          <Row type="flex">
            <Col span={8}><DescriptionItem title="Code" content={state.patient.code} /></Col>
            <Col span={8}><DescriptionItem title="Name" content={state.patient.name} /></Col>
            <Col span={8}><DescriptionItem title="Last Visit" content={lastVisit} /></Col>
            <Col span={8}><DescriptionItem title="Birthday" content={birthday} /></Col>
            <Col span={8}><DescriptionItem title="Age" content={age} /></Col>
            <Col span={8}><DescriptionItem title="Address" content={state.patient.address} /></Col>
            <Col span={8}><DescriptionItem title="Occupation" content={state.patient.occupation} /></Col>
            <Col span={8}><DescriptionItem title="Civil Status" content={state.patient.civil_status} /></Col>
            <Col span={8}><DescriptionItem title="Contact Number" content={state.patient.contact_number} /></Col>
          </Row>
          <Tabs defaultActiveKey="2">
            <TabPane tab="Treatments and/or Procedures" key="2">
              <TreatmentsTable role={props.role} getPatient={() => getRecordOnAddTreatment(props.code)} patientId={state.patient.id} />
            </TabPane>
            <TabPane tab="Dental Chart" key="3">
              <Row>
                <Col align="center" span={24}>
                  <Text strong>Legend: </Text>
                  <br />
                  <Tag color="#ffc53d">Decayed</Tag>
                  <Tag color="#ff4d4f">Missing</Tag>
                  <Tag color="#40a9ff">Filled Teeth</Tag>
                </Col>
                <Col align="center" md={{ span: 12 }} sm={{ span: 24 }}>
                  <ChildTeethChart patientId={state.patient.id} />
                </Col>
                <Col align="center" md={{ span: 12 }} sm={{ span: 24 }}>
                  <AdultTeethChart patientId={state.patient.id} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </React.Fragment>
      )}
    </React.Fragment>
  );

}

export default DentalRecord;