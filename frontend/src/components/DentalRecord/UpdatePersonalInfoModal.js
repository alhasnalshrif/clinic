import React, { useState } from 'react';
import { Form, Modal, Row, Col, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment';
import { EditFilled } from '@ant-design/icons';

const { Option } = Select;

function UpdatePersonalInfoModal(props) {
   const [form] = Form.useForm();

   const [state, setState] = useState({
      visible: false
   });

   // state = {
   //    visible: false
   // };

   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onUpdate(props.patient.code, values);
         hideModal();
      });
   }

   const showModal = () => {
      setState({ visible: true });
   }

   const hideModal = () => {
      setState({ visible: false });
      form.resetFields();
   }


   const validateContactNumber = (rule, value, callback) => {

      const myRegex = /^(09|\+639)\d{9}$/;

      if (!value)
         callback();
      else if (isNaN(parseInt(value)) || (myRegex.exec(value) == null && (value.length < 11 || value.length > 11))) {
         console.log(value.length);
         callback('Invalid Contact Number');
      }
      else
         callback();

   }


   return (
      <>
         <Button onClick={showModal} type="default"><EditFilled /> Update Info</Button>
         {/* <Modal
            visible={state.visible}
            title="Update Patient's Personal Info"
            okText="Update"
            onCancel={hideModal}
            onOk={handleSubmit}
         > */}
            <Form layout="vertical" onSubmit={handleSubmit}
               form={form}>
               <Row gutter={8}>
                  <Col span={24}>
                     <Form.Item label="Name" initialValue={props.patient.name} name="name" rules={[{ required: true, message: 'Name is required.' }]}>

                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Address" initialValue={props.patient.address} name="address" rules={[{ required: true, message: 'Address is required.' }]}>

                        <Input />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Birthday" initialValue={props.patient.birthday} name="birthday" rules={[{ required: true, message: 'Birthday is required.' }]}>

                        <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{ width: '100%' }} />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Occupation" initialValue={props.patient.occupation || ''} name="Occupation">

                        <Input />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Civil Status" initialValue={props.patient.civil_status || ''} name="civil_status">

                        <Select>
                           <Option value="single">Single</Option>
                           <Option value="married">Married</Option>
                           <Option value="widowed">Widowed</Option>
                           <Option value="separated">Separated</Option>
                        </Select>

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Contact Number" initialValue={props.patient.contact_number || ''} name="contact_number" rules={[{ validator: validateContactNumber }]}>

                        <Input />

                     </Form.Item>
                  </Col>
               </Row>
               <Button hidden htmlType="submit"></Button>
            </Form>
         {/* </Modal> */}
      </>
   );

}

export default UpdatePersonalInfoModal;