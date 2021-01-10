import React, { useState, useEffect } from 'react';
import { message, Modal, Form, Input, Row, Col, DatePicker, Select, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PlusCircleFilled } from '@ant-design/icons';

import { connect } from "react-redux";
import { createABNT } from "../../redux";

const { Option } = Select;



function CreateAppointmentModal(props, { createABNT }) {

   const [state, setState] = useState({
      visible: false,
   });

   const [formData, setFormData] = useState({
      token: null,
      reason: "",
      patient: "",
      doctor: "",
   });

   console.log(formData)

   const { patient, reason, doctor, token } = formData;

   console.log(formData)

   const onChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

   console.log(formData)




   // useEffect(() => {
   //    const fetchData = async () => {
   //       try {
   //          await props.getPATN();

   //       } catch (err) { }
   //    };

   //    fetchData();
   // }, []);

   console.log(props.patient)


   // const handleSubmit = (e) => {

   //    e.preventDefault();

   //    // props.form.validateFields((err, values) => {
   //    //    if (err)
   //    //       return

   //    props.createABNT(patient, reason);

   //    // hideModal();

   //    // });
   // }
   const onFinish = () => {
      console.log(formData)

      props.createABNT(formData);

   };

   console.log(onFinish())


   const showModal = () => {
      setState({ visible: true });
   }

   const hideModal = () => {
      setState({ visible: false });
      form.resetFields();
   }


   const disabledDateTime = () => {
      return {
         disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23],
      };
   }

   const [form] = Form.useForm();


   // const options = props.patient.map(d => <Option key={d.id}>{d.name}</Option>)

   return (
      <>
         <Button onClick={showModal} type="primary"><PlusCircleFilled />Create New Appointment</Button>

         <Modal
            visible={state.visible}
            title="Create a New Appointment"
            okText="Create"
            onCancel={hideModal}
         // onOk={onFinish}
         >


            <Form
               layout="vertical"
               //  onSubmit={handleSubmit}
               onFinish={onFinish}

               form={form}
            >

               <Row gutter={8}>
                  {/* <Col span={24}>
                     <Form.Item label="Date and Time" name="date" rules={[{ required: true, message: 'Date and Time is required.' }]} >


                        <DatePicker
                           name="date"
                           value={date}
                           onChange={(e) => onChange(e)}
                           disabledTime={disabledDateTime}
                           disabledDate={(current) => current && current < moment() || moment(current).day() === 0}
                           placeholder="Select date and time" style={{ width: '100%' }}

                           showTime={
                              {
                                 use12Hours: true, format: 'h:mm',
                                 defaultValue: moment('8:00', 'h:mm')
                              }
                           }
                           format="MMMM DD, YYYY h:mm A"
                        />

                     </Form.Item>
                  </Col> */}
                  <Col span={24}>
                     <Form.Item label="Patient Name" rules={[{ required: true, message: 'Patient name is required' }]}>

                        {/* <Select
                           name="patient"
                           allowClear
                           showSearch
                           placeholder=""
                           defaultActiveFirstOption={false}
                           showArrow={false}
                           filterOption={false}
                           notFoundContent={null}
                           value={patient}
                           onChange={(e) => onChange(e)}
                        >
                           {options}
                        </Select> */}
                        <Input
                           name="patient"
                           value={patient}
                           onChange={(e) => onChange(e)}
                        />
                     </Form.Item>

                  </Col>

                  <Col span={24}>
                     <Form.Item label="token" rules={[{ required: true, message: 'Reason is required.' }]}
                     >

                        <Input
                           name="token"
                           value={token}
                           onChange={(e) => onChange(e)}
                        />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Reason" rules={[{ required: true, message: 'Reason is required.' }]}
                     >

                        <Input
                           name="reason"
                           value={reason}
                           onChange={(e) => onChange(e)}
                        />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="doctor" rules={[{ required: true, message: 'Reason is required.' }]}
                     >

                        <Input
                           name="doctor"
                           value={doctor}
                           onChange={(e) => onChange(e)}
                        />

                     </Form.Item>
                  </Col>

               </Row>

               <Button type="primary" htmlType="submit">
                  Submita
               </Button>

            </Form>
         </Modal>
      </>
   );

}


const mapStateToProps = state => {
   return {

      patient: state.patient.patients,

      // loading: state.Abointment.loading
   };
};

// const mapDispatchToProps = dispatch => {
//    return {
//       createASNT: (asnt) => dispatch(createASNT(asnt))
//    };
// };

export default connect(
   mapStateToProps,
   { createABNT }

)(CreateAppointmentModal);





