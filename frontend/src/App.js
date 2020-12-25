import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Row, Col, Dropdown, Menu, Typography, Avatar } from 'antd';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { UserOutlined } from '@ant-design/icons';

// import axios from 'axios';

// MY COMPONENTS
import ProtectedRoute from './components/hoc/ProtectedRoute';
import SiderNavigation from './components/SiderNavigation';
// import SpinningComponent from './components/user/SpinningComponent';

// PAGES 
// import HomePage from './pages/HomePage';
// import Login from './pages/Login';
import PatientHomePage from './pages/PatientHomePage';
import PatientAccountSettings from './pages/PatientAccountSettings';
import Dashboard from './pages/Dashboard';
import DentalRecords from './pages/DentalRecords';
import Payments from './pages/Payments';
import Appointments from './pages/Appointments';
import SMSTextMessaging from './pages/SMSTextMessaging';
import UserAccounts from './pages/UserAccounts';

import Logo from './alhassn.png';
// import ResetPasswordLinkPage from './pages/ResetPasswordLinkPage';

import { LogoutOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Sider, Header } = Layout;


function App(props) {



   const [values, setValues] = useState({
      authenticated: true,
      user: '',
    
      loginLoading: false
   });



   // componentDidMount() {
   //    ;
   //    axios.get('users/checkToken')
   //       .then((response) => {
   //          if (response.status === 200) {
   //             setState({ authenticated: true, user: response.data.user });
   //          }
   //       }).catch((err) => {
   //          if (err)
   //             setState({ authenticated: false });
   //       });
   // }

   // const handleLogin = (formValues) => {
   //    setValues({ loginLoading: true });
   //    return axios.post('users/login', formValues)
   //       .then((response) => {
   //          if (response.data.error === undefined) {
   //             setValues({ authenticated: true, user: response.data.user });
   //             setTimeout(() => {
   //                setValues({ loginLoading: false });
   //             }, 1000);

   //          }
   //          return response;
   //       })
   // }


   // const handleLogout = () => {

   //    message({
   //       title: 'System Message',
   //       content: 'Are you sure you want to Logout?!',
   //       okText: 'Yes',
   //       okType: 'danger',
   //       cancelText: 'No',
   //       onOk: () => {
   //          axios.post('users/logout')
   //             .then((response) => {
   //                if (response.status === 200)
   //                   setValues({ authenticated: false, user: '' });
   //             })
   //             .catch((err) => {
   //                console.log(err);
   //             });
   //       },
   //       onCancel() {

   //       },
   //    });

   // }

   const logoutMenu = (

      // {/* <Menu.Item key="1" onClick={handleLogout}> */ }

      <Menu >
         <Menu.Item key="1" >
            <LogoutOutlined />

               Logout
         </Menu.Item>
      </Menu >
   );

   return (
      <div className="App">
         <Router>

            <>

               {/* <Route render={({ location }) => (
                        <TransitionGroup>
                           <CSSTransition
                              onEnter={() => {
                                 window.scrollTo(0, 0);
                              }}
                              key={location.key}
                              timeout={500}
                              classNames="move"
                           >
                              <Switch location={location}>
                                 <Route exact path="/" render={() => <HomePage handleLogin={handleLogin} />} />
                                 <Route exact path="/resetPassword/:token" component={ResetPasswordLinkPage} />
                                 <Route exact path={["/", "/login"]} render={(routeProps) => <Login {...routeProps} handleLogin={handleLogin} />} />
                                 <Route render={() => <Redirect to="/" />} />
                              </Switch>
                           </CSSTransition>
                        </TransitionGroup>
                     )} /> */}



               <Layout> 
                  <Sider
                     trigger={null}
                     collapsed={0}
                     breakpoint="lg"
                     width="15%"
        
                     style={{ minHeight: '100vh', boxShadow: '3px 0px 15px 2px #8c8c8c' }}
                  >
                     <div className="logo">
                        <img style={{ width: '100%', maxWidth: '150px' }} src={Logo} />
                        <br />
                        {
                           values.user === 'patient' ? (
                              <Text style={{ color: '#fff' }}> alsherif <br />Dental</Text>
                           ) : (
                                 <Text style={{ color: '#fff' }}></Text>
                              )
                        }

                     </div>
                     <SiderNavigation role={values.user} />
                  </Sider>

                  <Layout>

                     <Header style={{ boxShadow: '0px -1px 3px rgba(0, 0, 0, 1)',  background: '#fff', width: '100%' }}>
                        <Row>


                           <Col style={{ paddingRight: 16 }} align="right" span={24}>
                              <Dropdown overlay={logoutMenu} trigger={['click']}>

                                 <a className="ant-dropdown-link" href="#">
                                    <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                                    {/* <Text style={{ color: '#1890ff' }}> {'Logged in as ' + values.user.username} </Text> */}
                                    {/* <Icon type="down" /> */}
                                 </a>
                              </Dropdown>
                           </Col>

                        </Row>

                     </Header>

                     <Layout style={{minHeight: '100vh' }}>

                        <Route render={({ location }) => (
                           <TransitionGroup>
                              <CSSTransition
                                 onEnter={() => {
                                    window.scrollTo(0, 0);
                                 }}
                                 key={location.key}
                                 timeout={500}
                                 classNames="move"
                              >
                                 <Switch location={location}>
                                    {/* <Route exact path={["/", "/login"]} render={(props) => {
                                       if (values.user.role === 'dentalaide')
                                          return <Redirect to="/dentalrecords" />
                                       else if (values.user.role === 'dentist')
                                          return <Redirect to="/dashboard" />
                                       return <Redirect to="/home" />
                                    }} /> */}

                                    <ProtectedRoute exact path="/home" component={PatientHomePage} user={values.user} />
                                    <ProtectedRoute exact path="/settings" component={PatientAccountSettings} user={values.user} />
                                    <ProtectedRoute exact path="/dashboard" component={Dashboard} />
                                    <ProtectedRoute exact path="/dentalrecords" component={DentalRecords} />
                                    <ProtectedRoute exact path="/dentalrecords/:code" component={DentalRecords} user={values.user} />
                                    <ProtectedRoute exact path="/transactionlog" component={Payments} />
                                    <ProtectedRoute exact path="/appointments" component={Appointments} />
                                    <ProtectedRoute exact path="/sms" component={SMSTextMessaging} />
                                    <ProtectedRoute exact path="/useraccounts" component={UserAccounts} />
                                    <ProtectedRoute exact path="/useraccounts/:id" component={UserAccounts} />
                                 </Switch>
                              </CSSTransition>
                           </TransitionGroup>
                        )} />

                     </Layout>
                  </Layout>

               </Layout>

            </>




         </Router>
      </div>
   );

}

export default App;
