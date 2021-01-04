import React, { useState } from 'react';
import {
   Tooltip, Drawer, Form, Button, Col, Row, Input, DatePicker, message, notification
} from 'antd';
import moment from 'moment';
import axios from 'axios';



function RegisterDrawer(props) {
   const [form] = Form.useForm();

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


   const onClose = () => {
      setState({
         visible: false,
      });
      form.resetFields()
   };

   const handleSubmit = (e) => {
      e.preventDefault();

   }

   const handleRegister = (values) => {
      setState({ registerLoading: true });
      values.birthday = values.birthday.format('YYYY-MM-DD');
      axios.post('auth/users/', values)
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
      <>

         <a onClick={showDrawer} target="_blank" rel="noopener noreferrer">Register</a>
         <Drawer
            title="Register New Patient Account"
            placement="right"
            width={800}
            onClose={onClose}
            visible={state.visible}
         >
            <Form onSubmit={handleSubmit}
               form={form}>
               <Row gutter={16}>
                  
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
                     <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required' }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>

                     <Form.Item label="Email Address" name="emailaddress" rules={[{ required: true, message: 'Email Address  is required' }]}>
                        <Input />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
                        <Input.Password />
                     </Form.Item>
                  </Col>
                  <Col span={12}>
                     <Form.Item label="Confirm Password" name="confirm_password" rules={[{ required: true, message: 'Please confirm your password' }]}>
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
      </>
   );

}


export default RegisterDrawer;