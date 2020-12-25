import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, Alert, Tooltip, message, notification } from 'antd';
import axios from 'axios';


function ForgotPasswordModal(props) {

   const [state, setState] = useState({
      visible: false,
      sending: false
   });


   const handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
         if (err)
            return;
         this.setState({ sending: true });
         axios.post(`users/forgotPassword`, values)
            .then((response) => {
               if (response.status === 200) {
                  this.hideModal();
                  notification['info']({
                     message: 'Reset Password Link Sent!',
                     description: 'A password link reset has been sent to your email. Kindly check your email inbox',
                     duration: 5
                  });
               }
            })
            .catch((err) => {
               console.log(err);
               message.error('Internal server error!');
            });
      });
   }


   const showModal = () => {
      this.setState({ visible: true });
   }

   const hideModal = () => {
      this.props.form.resetFields();
      this.setState({ visible: false, sending: false });
   }

   const compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
         callback('Two passwords that you enter is inconsistent!');
      }
      else if (form.getFieldValue('password') && !value) {
         callback('Please confirm your password');
      }
      else {
         callback();
      }
   }


   const validateToNextPassword = (rule, value, callback) => {
      // const form = this.props.form;
      // if (value) {
      // //   form.validateFields(['confirm_password'], { force: true });
      // }
      callback();
   }


   return (
      <React.Fragment>
         <a disabled={this.props.disabled} onClick={this.showModal} target="_blank" rel="noopener noreferrer">Forgot Password?</a>
         <Modal
            visible={this.state.visible}
            title="Reset Your Password"
            okText="Send Reset Password Link"
            onCancel={this.hideModal}
            onOk={this.handleSubmit}
            okButtonProps={{ loading: this.state.sending }}
            style={{ top: 40 }}
         >
            {

               <Alert stylx={{ marginBottom: 11 }} type="info" showIcon message="A reset password link will be sent to your email address to reset your password using the provided new password." />

            }
            <Form style={{ marginTop: 11 }} layout="vertical">
               <Row>

                  <Col span={24}>

                     <Form.Item label="Email Address" name="emailaddress" rules={[{ required: true, message: 'Email Address is required' }]}>
                        <Tooltip title="Email Address used when you registered your account.">

                           <Input />

                        </Tooltip>
                     </Form.Item>

                  </Col>
                  <Col span={24}>
                     <Form.Item label="New Password" name="password" rules={[{ required: true, message: 'New password  is required' }]}>

                        <Input.Password />

                     </Form.Item>
                  </Col>
                  <Col span={24}>
                     <Form.Item label="Confirm New Password" name="confirm_password" rules={[{ required: true, message: 'Confirm your new password' }]}>

                        <Input.Password />

                     </Form.Item>
                  </Col>

               </Row>
            </Form>
         </Modal>
      </React.Fragment>
   );

}


export default ForgotPasswordModal;