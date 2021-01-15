import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Row, Col, Tag, Tabs, message, Select } from 'antd';
// import axios from 'axios';
import moment from 'moment';

import DescriptionItem from './DescriptionItem';
import AdultTeethChart from '../dental/AdultTeethChart';
import ChildTeethChart from '../dental/ChildTeethChart';

import TreatmentsTable from '../treatment/TreatmentsTable';

// import UpdatePersonalInfoModal from './UpdatePersonalInfoModal';
import { connect } from "react-redux";
import { getPATNDetail } from "../../redux";

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;



function DentalRecord(props) {



  const [selectedOption, setSelectedOption] = useState("adult");

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

  // const getRecordOnAddTreatment = (id) => {
    // axios.get(`patients/${id}`)
    //   .then((response) => {
    //     if (response.status === 200)
    //       setState({ patient: response.data });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     message.error('Something went wrong! Please, try again.');
    //   });

  // }

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

  const lastVisit = !props.patient.last_visit ? (<Tag color="geekblue">New Record</Tag>) : moment(props.patient.last_visit).format('MMMM, DD YYYY');
  const birthday = moment(props.patient.birthday).format('MMMM DD, YYYY');
  const age = moment().diff(props.patient.birthday, 'years');

  return (

    <>

      <Row type="flex">
        <Col span={8}><DescriptionItem title="الكود" content={props.patient.id} /></Col>
        <Col span={8}><DescriptionItem title="الاسم" content={props.patient.name} /></Col>
        <Col span={8}><DescriptionItem title="اخر زياره" content={lastVisit} /></Col>
        <Col span={8}><DescriptionItem title="تاريخ الميلاد" content={birthday} /></Col>
        <Col span={8}><DescriptionItem title="العمر" content={age} /></Col>
        <Col span={8}><DescriptionItem title="العنوان" content={props.patient.address} /></Col>
        <Col span={8}><DescriptionItem title="المهنه" content={props.patient.occupation} /></Col>
        <Col span={8}><DescriptionItem title="رقم الهاتف" content={props.patient.phone} /></Col>
      </Row>

      <Tabs defaultActiveKey="2">

        <TabPane tab="العلاجات و / أو الإجراءات" key="2">
          <TreatmentsTable  patientId={props.patient.id} />
          {/* <TreatmentsTable role={props.role} getPatient={() => getRecordOnAddTreatment(props.id)} patientId={props.patient.id} /> */}
        </TabPane>

        <TabPane tab="الاسنان" key="3">

          <Row>

            <Col align="center" span={24}>

              <Text strong>عنوان : </Text>
              <br />
              <Tag color="#ffc53d">فاسد</Tag>
              <Tag color="#ff4d4f">مفقودة</Tag>
              <Tag color="#40a9ff">محشو</Tag>
            </Col>


            <Select
              style={{ width: 120 }}
              onChange={value => {
                console.log(value);
                setSelectedOption(value)
              }}
              defaultValue={selectedOption}

            >


              <Option value={"adult"}>
                بالغ
              </Option>

              <Option value={"child"}>
                طفل
              </Option>
            </Select>

            {selectedOption === "child" ? (
              <ChildTeethChart patientId={props.patient.id} />

            ) : (
                <AdultTeethChart patientId={props.patient.id} />

              )}



          </Row>
        </TabPane>


      </Tabs>


    </>
  );

}


const mapStateToProps = state => {
  return {

    patient: state.patient.patientsDetail,
  };
};


export default connect(
  mapStateToProps,
  { getPATNDetail }
)(DentalRecord);



