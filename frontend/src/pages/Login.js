import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Divider, Typography, notification, Form, Input, Button } from 'antd';
import { UserAddOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import ForgotPasswordModal from '../components/register/ForgotPasswordModal';

import { login } from "../redux";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
const { Title } = Typography;

const Login = (props, { isAuthenticated }) => {

   // useEffect(() => {
   //    if (props.location.state) {
   //       if (props.location.state.resetPasswordStatus)
   //          notification['success']({
   //             message: 'Password Reset Successful!',
   //             description: 'Your password has been resetted sucessfully. You may now login with your new password.',
   //             duration: 5
   //          });
   //       else if (props.location.state.resetPasswordStatus === false)
   //          notification['error']({
   //             message: 'Password Reset Error',
   //             description: 'Expired or invalid reset password link.',
   //             duration: 5
   //          });
   //    }
   // }, []);



   const [formValues, setFormValues] = useState({
      username: "",
      password: "",
   });

   const { username, password } = formValues;

   const onChange = (e) => {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
   }

   const onFinish = () => {
      props.login(username, password);
      console.log(username, password);
   };


   if (isAuthenticated) return <Redirect to="/" />;

   return (
      <div style={{ minHeight: '100vh' }}>
         <Row type="flex" align="middle" style={{ minHeight: '100vh' }}>
            <Col md={{ span: 8, offset: 8 }} sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
               <Card bordered={true} style={{ boxShadow: '0px 3px 10px -4px #8c8c8c' }}>
                  <Link to="/">Back to homepage</Link>
                  <Title style={{ textAlign: 'center', marginTop: 18, marginBottom: 0 }} level={3}>
                     Andres Dental Clinic Portal
                     </Title>
                  <Divider style={{ margin: '6px 0 12px 0' }} />

                  <Form style={{ textAlign: "center" }}
                     name="normal_login"
                     className="login-form"
                     initialValues={{ remember: true }}
                     onFinish={onFinish}
                  >

                     <Form.Item style={{ margin: 0 }} label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>

                        <Input
                           prefix={<UserAddOutlined className="site-form-item-icon" />}
                           type="username"
                           placeholder="Username"
                           name="username"
                           value={username}
                           onChange={(e) => onChange(e)}
                           required
                        />

                     </Form.Item>
                     <Form.Item style={{ margin: 0 }} label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>

                        <Input.Password
                           prefix={<LockOutlined className="site-form-item-icon" />}
                           type="password"
                           placeholder="Password"
                           name="password"
                           value={password}
                           onChange={(e) => onChange(e)}
                           minLength="8"
                           required
                        />
                     </Form.Item>
                     <Form.Item style={{ marginTop: 11 }}>
                        <Button block type="primary" htmlType="submit" className="login-form-button">
                           <LoginOutlined />
                              Log in
                        </Button>
                     </Form.Item>
                  </Form>
                  <div style={{ textAlign: 'right' }}>
                     <ForgotPasswordModal />
                  </div>
               </Card>
            </Col>
         </Row>
      </div>
   );
}


const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,

});

export default connect(mapStateToProps, { login })(Login);
