import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Skeleton, Row, Col, Tag, Tabs, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

import DescriptionItem from './DescriptionItem';
import AdultTeethChart from '../dental/AdultTeethChart';
import ChildTeethChart from '../dental/ChildTeethChart';

import TreatmentsTable from './TreatmentsTable';

import UpdatePersonalInfoModal from './UpdatePersonalInfoModal';
import { connect } from "react-redux";
import { getPATNDetail } from "../../redux";

const { TabPane } = Tabs;
const { Text } = Typography;



function DentalRecord(props) {

  const [state, setState] = useState({
    loading: true,
    patient: {},
    treatments: []
  });

  useEffect(() => {

    props.getPATNDetail(props.id);

  }, []);


  console.log(props.patient)
  console.log(props)

  // const getRecord = (id) => {
  //   setState({ loading: true });
  //   axios.get(`patients/${id}`)
  //     .then((response) => {
  //       if (response.status === 200)
  //         setState({ patient: response.data });
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         setState({ loading: false });
  //       }, 800)
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       message.error('Something went wrong! Please, try again.');
  //     });
  // }

  const getRecordOnAddTreatment = (id) => {
    axios.get(`patients/${id}`)
      .then((response) => {
        if (response.status === 200)
          setState({ patient: response.data });
      })
      .catch((err) => {
        console.error(err);
        message.error('Something went wrong! Please, try again.');
      });
  }

  // const handleUpdate = (id, values) => {
  //   const hide = message.loading('Updating Personal Info...', 0);
  //   values.birthday = values.birthday.format('YYYY-MM-DD');
  //   axios.patch(`patients/${id}`, values)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         hide();
  //         message.success('Personal Info Updated Successfully');
  //         getRecord(id);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       hide();
  //       message.error('Something went wrong! Please, try again.');
  //     });
  // }

  const lastVisit = !state.patient.last_visit ? (<Tag color="geekblue">New Record</Tag>) : moment(state.patient.last_visit).format('MMMM, DD YYYY');
  const birthday = moment(state.patient.birthday).format('MMMM DD, YYYY');
  const age = moment().diff(state.patient.birthday, 'years');

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Row>
          <Col align="left">
            <Link to="/dentalrecords"> Back to Dental Records</Link>
          </Col>
          {/* <Col align="right">
            <UpdatePersonalInfoModal patient={state.patient} onUpdate={handleUpdate} />
          </Col> */}

          <Col align="center" md={{ span: 12 }} sm={{ span: 24 }}>
            <AdultTeethChart patientId={state.patient.id} />
          </Col>

        </Row>

      </div>

      {/* {state.loading ? (<Skeleton loading={state.loading} paragraph={{ rows: 14 }} active />) : ( */}
      <>
        <Row type="flex">
          <Col span={8}><DescriptionItem title="Code" content={props.patient.id} /></Col>
          <Col span={8}><DescriptionItem title="Name" content={props.patient.name} /></Col>
          <Col span={8}><DescriptionItem title="Last Visit" content={lastVisit} /></Col>
          <Col span={8}><DescriptionItem title="Birthday" content={birthday} /></Col>
          <Col span={8}><DescriptionItem title="Age" content={age} /></Col>
          <Col span={8}><DescriptionItem title="Address" content={props.patient.address} /></Col>
          <Col span={8}><DescriptionItem title="Occupation" content={props.patient.occupation} /></Col>
          <Col span={8}><DescriptionItem title="Civil Status" content={props.patient.civil_status} /></Col>
          <Col span={8}><DescriptionItem title="Contact Number" content={props.patient.phone} /></Col>
        </Row>
        <Tabs defaultActiveKey="2">
          <TabPane tab="Treatments and/or Procedures" key="2">
            {/* <TreatmentsTable role={props.role} getPatient={() => getRecordOnAddTreatment(props.id)} patientId={state.patient.id} /> */}
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
      </>
      {/* )} */}
    </>
  );

}


const mapStateToProps = state => {
  return {

    patient: state.patient.patientsDetail,
    // loading: state.Abointment.loading
  };
};


export default connect(
  mapStateToProps,
  { getPATNDetail }
)(DentalRecord);



