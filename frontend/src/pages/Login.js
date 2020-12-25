import React from 'react';
import { Row, Col, Card, Divider, Typography, Icon, notification } from 'antd';
import LoginForm from '../components/register/LoginForm';
// import Background from '../isometric-bg.jpg';
import { Link } from 'react-router-dom';

const { Title } = Typography;

// class Login extends React.Component {
function Login(props) {

   // componentDidMount() {
   //    if (this.props.location.state) {
   //       if (this.props.location.state.resetPasswordStatus)
   //          notification['success']({
   //             message: 'Password Reset Successful!',
   //             description: 'Your password has been resetted sucessfully. You may now login with your new password.',
   //             duration: 5
   //          });
   //       else if (this.props.location.state.resetPasswordStatus === false)
   //          notification['error']({
   //             message: 'Password Reset Error',
   //             description: 'Expired or invalid reset password link.',
   //             duration: 5
   //          });
   //    }

   // }

      return (
         <div style={{ minHeight: '100vh' }}>
            <Row type="flex" align="middle" style={{ minHeight: '100vh' }}>
               <Col md={{ span: 8, offset: 8 }} sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
                  <Card bordered={true} style={{ boxShadow: '0px 3px 10px -4px #8c8c8c' }}>
                     <Link to="/"><Icon type="arrow-left" /> Back to homepage</Link>
                     <Title style={{ textAlign: 'center', marginTop: 18, marginBottom: 0 }} level={3}>
                        Andres Dental Clinic Portal
                     </Title>
                     <Divider style={{ margin: '6px 0 12px 0' }} />
                     <LoginForm handleLogin={props.handleLogin} />
                  </Card>
               </Col>
            </Row>
         </div>
      );
   }


export default Login;