import React, { useEffect } from "react";
import { Layout, Row, Col, Dropdown, Menu, Typography, Avatar } from 'antd';

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { checkAuthenticated, load_user, logout } from "../redux";
import SiderNavigation from './SiderNavigation';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import Logo from './tothh.png';
import Login from '../pages/Login';

import "./Layout.css";


const { Sider, Header } = Layout;
const { Text } = Typography;

const CustomLayout = (props) => {

  const check = props.checkAuthenticated
  const load = props.load_user
  useEffect(() => {
    const fetchData = async () => {

      await check();
      await load();

    }
    fetchData();
  }, [check, load]);



  return (
    <>

      {props.isAuthenticated ? (

        <Layout className="layout">


          <Sider
            trigger={null}
            collapsed={0}
            breakpoint="lg"
            width="275px"

            style={{ height: '100vh', position: 'fixed', right: 0, overflow: 'auto', }}
          >
            <div className="logo">
              <img style={{ width: '100%', maxWidth: '150px', height: '120px' }} src={Logo} />
              <br />

              <Text style={{ color: '#fff' }}></Text>


            </div>
            <SiderNavigation />

          </Sider>

          <Layout className="site-layout" style={{ marginRight: "275px", minHeight: '100vh' }}>

            <Header style={{ background: '#F0F2F5', width: '100%' }}>

              <Row>

                <Col align="left" span={24}>




                  <Dropdown overlay={
                    <Menu style={{ marginTop: 10 }}>
                      <Menu.Item key="1" >
                        <Link to={`/settings`}>
                          <SettingOutlined style={{ marginLeft: 8, marginRight: 0 }} />
                            الاعدادات
                          </Link>
                      </Menu.Item>
                      <Menu.Item key="2" onClick={props.logout}>
                        <LogoutOutlined />
                        تسجيل الخروج

                      </Menu.Item>
                    </Menu >
                  }

                    trigger={['click']}>
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

      ) : (
          <Login />
        )}

    </>
  );
};

const mapStateToProps = state => {
  return {

    username: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,


  };
};

export default connect(mapStateToProps, { checkAuthenticated, load_user, logout })(CustomLayout);