import React,{useState} from 'react';
import {
   Form, Icon, Input, Button, Modal, Typography
} from 'antd';
import ForgotPasswordModal from './ForgotPasswordModal';


function NormalLoginForm(props) {

      const [state, setState] = useState({
         account: {}
      });

      const handleSubmit = (e) => {
      e.preventDefault();
      props.form.validateFields((err, values) => {
         if (!err) {
            props.handleLogin(values)
               .then((response) => {
                  if (response.data.error) {
                     Modal.error({
                        title: 'System Message',
                        content: response.data.error,
                     });
                  }
               })
               .catch((err) => {
                  console.log('Error inside catch LoginForm', err);
                  Modal.error({
                     title: 'System Message',
                     content: 'Internal server error',
                  });
               });
         }
      });
   }

      return (
         <React.Fragment>
            <Form onSubmit={handleSubmit} className="login-form" >
               <Form.Item style={{ margin: 0 }} label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>

                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />

               </Form.Item>
               <Form.Item style={{ margin: 0 }} label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>

                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />

               </Form.Item>
               <Form.Item style={{ marginTop: 11 }}>
                  <Button block type="primary" htmlType="submit" className="login-form-button">
                     <Icon type="login" />
                     Log in
                  </Button>
               </Form.Item>
            </Form>
            <div style={{ textAlign: 'right' }}>
               <ForgotPasswordModal />
            </div>
         </React.Fragment>
      );
   
}

const LoginForm = Form.create()(NormalLoginForm);

export default LoginForm;