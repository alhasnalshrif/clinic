import React, { useEffect } from "react";
import { Layout, Row, Col, Dropdown, Menu, Typography, Avatar } from 'antd';

import { connect } from "react-redux";

import { checkAuthenticated, load_user, logout } from "../redux";
import SiderNavigation from './SiderNavigation';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Logo from '../alhassn.png';
import Login from '../pages/Login';

import "./Layout.css";

const { Sider, Header } = Layout;
const { Text } = Typography;

const CustomLayout = (props) => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        await props.checkAuthenticated();
        await props.load_user();
      } catch (err) { }
    };

    fetchData();
  }, []);




  return (
    <>

      {!props.isAuthenticated ? (
        <Login />
      ) : (
          <Layout className="layout">


            <Sider
              trigger={null}
              collapsed={0}
              breakpoint="lg"
              width="15%"

              // style={{ height: '100vh', background: '#3f4d67', boxShadow: '3px 0px 15px 2px #8c8c8c', position: 'fixed', left: 0, overflow: 'auto', }}
              style={{ height: '100vh', boxShadow: '3px 0px 15px 2px #8c8c8c', position: 'fixed', left: 0, overflow: 'auto', }}
            >
              <div className="logo">
                <img style={{ width: '100%', maxWidth: '150px' }} src={Logo} />
                <br />

                <Text style={{ color: '#fff' }}></Text>


              </div>
              <SiderNavigation />

            </Sider>

            <Layout className="site-layout" style={{ marginLeft: "15%" }}>

              <Header style={{ boxShadow: '0px -1px 3px rgba(0, 0, 0, 1)', background: '#fff', width: '100%' }}>
                <Row>
                  <Col style={{ paddingRight: 16 }} align="right" span={24}>
                    <Dropdown overlay={
                      <Menu >
                        <Menu.Item key="1" onClick={props.logout}>
                          <LogoutOutlined />
                      Logout
                  </Menu.Item>
                      </Menu >
                    } trigger={['click']}>
                      <a className="ant-dropdown-link" >
                        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                        {props.username == null ? (
                          <Text style={{ color: '#1890ff' }}> hey there </Text>

                        ) : (
                            <Text style={{ color: '#1890ff' }}> {props.username.username} </Text>


                          )}
                      </a>
                    </Dropdown>
                  </Col>
                </Row>
              </Header>

              {props.children}


            </Layout>

          </Layout>
        )}

    </>
  );
};

const mapStateToProps = state => {
  return {
    // token: state.auth.token,
    username: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,


  };
};

export default connect(mapStateToProps, { checkAuthenticated, load_user, logout })(CustomLayout);
