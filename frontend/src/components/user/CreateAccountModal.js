import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, Select, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { UsergroupAddOutlined } from '@ant-design/icons';

const { Option } = Select;



function CreateAccountModal(props) {
   const [form] = Form.useForm();

   const [state, setState] = useState({
      confirmDirty: false,
      visible: false,
      selectedRole: ''
   });


   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return
         props.onCreate(values);
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

   const handleConfirmBlur = (e) => {
      const value = e.target.value;
      setState({ confirmDirty: state.confirmDirty || !!value });
   }

   const handleSelectRoleChange = (value) => {
      setState({ selectedRole: value });
   }

   const compareToFirstPassword = (rule, value, callback) => {
      const form = props.form;
      if (value && value !== form.getFieldValue('password')) {
         callback('Two passwords that you enter is inconsistent!');
      } else {
         callback();
      }
   }


   const validateToNextPassword = (rule, value, callback) => {
      const form = props.form;
      if (value && state.confirmDirty) {
         form.validateFields(['confirm_password'], { force: true });
      }
      callback();
   }

   const validateUsername = async (rule, value, callback) => {
      // const form = props.form;
      if (value)
         await axios.post(`users/${value}/validate`)
            .then((response) => {
               if (response.status === 200) {
                  console.log(response.data.isValid);
                  if (!response.data.isValid)
                     callback('Username already taken!');
                  else
                     callback();
               }
            })
            .catch((err) => {
               console.log(err);
               message.error('Internal server error!');
            });
      else
         callback();

   }


   return (
      <>
         <Button type="primary" onClick={showModal}>
            <UsergroupAddOutlined />
                  Create New User Account
               </Button>
         <Modal
            visible={state.visible}
            title="Create a New User Account"
            okText="Create"
            onCancel={hideModal}
            onOk={handleSubmit}
         >
            <Form layout="vertical" onSubmit={handleSubmit} form={form}>

               <Row>
                  <Col span={24}>
                     <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required.' }]}>

                        <Input />

                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={8}>
                  <Col span={12}>
                     <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required.' }]}>

                        <Input />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Birthday is required.' }]}>

                        <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{ width: '100%' }} />

                     </Form.Item>
                  </Col>
               </Row>

               <Row gutter={8}>
                  <Col span={12}>
                     <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required.' }, { validator: validateUsername }]}>

                        <Input />

                     </Form.Item>
                  </Col>

                  <Col span={12}>
                     <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Role is required.' }]} initialValue={'dentalaide'}>

                        <Select onChange={handleSelectRoleChange}>
                           <Option value="dentalaide">Dental Aide</Option>
                           <Option value="dentist">Dentist</Option>
                        </Select>

                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={8}>
                  <Col span={12}>
                     <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required.' }, { validator: validateToNextPassword }]}>

                        <Input.Password />

                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Confirm Password" name="confirm_password" rules={[{ required: true, message: 'Please confirm your password' }, { validator: compareToFirstPassword }]} >

                        <Input.Password />

                     </Form.Item>
                  </Col>

                  {state.selectedRole === 'dentist' ? (
                     <Col span={24}>
                        <Form.Item label="Email Address" name="emailaddress" rules={[{ required: true, message: 'Email Address  is required.' }]}>

                           <Input />

                        </Form.Item>
                     </Col>
                  ) : null}

               </Row>
               <Button hidden htmlType="submit"></Button>
            </Form>
         </Modal>
      </>
   );

}

export default CreateAccountModal;