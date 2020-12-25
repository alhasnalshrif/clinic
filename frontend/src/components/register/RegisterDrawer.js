import React, { useState } from 'react';
import {
   Tooltip, Drawer, Form, Button, Col, Row, Input, DatePicker, message, notification
} from 'antd';
import moment from 'moment';
import axios from 'axios';



function RegisterDrawer(props) {

   const [state, setState] = useState({
      visible: false,
      confirmDirty: false,
      registerLoading: false
   });



   const showDrawer = () => {
      setState({
         visible: true,
      });
   };

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

   const validatePatientCode = async (rule, value, callback) => {
      const form = props.form;
      if (value)
         await axios.post(`patients/${value}/validate`)
            .then((response) => {
               if (response.status === 200) {
                  console.log(response.data.isValid);
                  if (!response.data.isValid)
                     callback('Invalid patient code');
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

   const validateUsername = async (rule, value, callback) => {
      const form = props.form;
      if (value)
         await axios.post(`users/${value}/validate`)
            .then((response) => {
               if (response.status === 200) {
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

   const validateEmailFormat = (email) => {

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   }

   const validateEmail = async (rule, value, callback) => {
      const form = props.form;
      if (validateEmailFormat(value)) {
         if (value) {
            await axios.post(`users/${value}/validateEmail`)
               .then((response) => {
                  if (response.status === 200) {
                     if (!response.data.isValid)
                        callback('Email Address already used!');
                     else
                        callback();
                  }
               })
               .catch((err) => {
                  console.log(err);
                  message.error('Internal server error!');
               });
         }
      }
      else if (!validateEmailFormat(value) && value !== '') {
         callback('Invalid Email Address format')
      }
      callback();

   }

   const onClose = () => {
      setState({
         visible: false,
      });
      props.form.resetFields();
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return;
         handleRegister(values);

      });
   }

   const handleRegister = (values) => {
      setState({ registerLoading: true });
      values.birthday = values.birthday.format('YYYY-MM-DD');
      axios.post('users/register', values)
         .then((response) => {
            if (response.status === 200) {
               setTimeout(() => {
                  onClose();
                  setState({ registerLoading: false });
                  notification['success']({
                     message: 'Registration Successful!',
                     description: 'You can now login through our portal to access services provided to you as a patient',
                     duration: 5
                  });
               }, 1000);
            }
         })
         .catch((err) => {
            console.log(err);
            setTimeout(() => {
               onClose();
               setState({ registerLoading: false });
               notification['error']({
                  message: 'Registration Error!',
                  description: 'Something went wrong! Please, try again.',
                  duration: 5
               });
            }, 1000);
         });
   }


   return (
      <React.Fragment>

         <a onClick={showDrawer} target="_blank" rel="noopener noreferrer">Register</a>
         <Drawer
            title="Register New Patient Account"
            placement="right"
            width={800}
            onClose={onClose}
            visible={state.visible}
         >
            <Form onSubmit={handleSubmit}>
               <Row gutter={16}>
                  <Col span={24}>
                     <Form.Item label="Patient Code" name="patient_code" rules={[{ required: true, message: 'Patient Code is required and must be valid' }, { validator: validatePatientCode }]}>
                        <Tooltip title="Patient Code given by the clinic. This is used to link this account to your record in the clinic">
                           <Input />
                        </Tooltip>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: 'Birthday is required' }]}>
                        <DatePicker disabledDate={(current) => current && current > moment()} format="MMMM DD, YYYY" style={{ width: '100%' }} />
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required' }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required' }, { validator: validateUsername }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>

                     <Form.Item label="Email Address" name="emailaddress" rules={[{ required: true, message: 'Email Address  is required' }, { validator: validateEmail }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }, { validator: validateToNextPassword }]}>
                        <Input.Password />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Confirm Password" name="confirm_password" rules={[{ required: true, message: 'Please confirm your password' }, { validator: compareToFirstPassword }]}>
                        <Input.Password />
                     </Form.Item>
                  </Col>
               </Row>
               <Button hidden htmlType="submit"></Button>
            </Form>
            <div
               style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
               }}
            >
               <Button onClick={onClose} style={{ marginRight: 8 }}>
                  Cancel
                  </Button>
               <Button onClick={handleSubmit} loading={state.registerLoading} type="primary">
                  Register
                  </Button>
            </div>
         </Drawer>
      </React.Fragment>
   );

}


export default RegisterDrawer;