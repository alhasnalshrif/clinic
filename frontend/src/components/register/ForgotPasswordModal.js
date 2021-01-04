import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, Alert, Tooltip, message, notification } from 'antd';
import axios from 'axios';


function ForgotPasswordModal(props) {
   const [form] = Form.useForm();

   const [state, setState] = useState({
      visible: false,
      sending: false
   });


   const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (err)
            return;
         setState({ sending: true });

         axios.post(`users/forgotPassword`, values)

            .then((response) => {
               if (response.status === 200) {
                  hideModal();
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
      setState({ visible: true });
   }

   const hideModal = () => {
      form.resetFields();
      setState({ visible: false, sending: false });
   }

   const compareToFirstPassword = (rule, value, callback) => {
      const form = props.form;
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
      // const form = props.form;
      // if (value) {
      // //   form.validateFields(['confirm_password'], { force: true });
      // }
      callback();
   }


   return (
      <React.Fragment>
         <a disabled={props.disabled} onClick={showModal} target="_blank" rel="noopener noreferrer">Forgot Password?</a>
         <Modal
            visible={state.visible}
            title="Reset Your Password"
            okText="Send Reset Password Link"
            onCancel={hideModal}
            onOk={handleSubmit}
            okButtonProps={{ loading: state.sending }}
            style={{ top: 40 }}
         >
            {

               <Alert stylx={{ marginBottom: 11 }} type="info" showIcon message="A reset password link will be sent to your email address to reset your password using the provided new password." />

            }
            <Form style={{ marginTop: 11 }} layout="vertical" form={form}>

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