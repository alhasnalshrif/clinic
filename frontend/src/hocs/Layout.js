import React, { useEffect } from "react";
import { Layout, Row, Col, Dropdown, Menu, Typography, Avatar } from 'antd';

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { checkAuthenticated, load_user, logout } from "../redux";
import SiderNavigation from './SiderNavigation';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import Logo from '../tothh.png';
import Login from '../pages/Login';

import "./Layout.css";

const data = [
  {
    id: '000000001',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: '你收到了 14 份新周报',
    datetime: '2017-08-09',
    type: 'notification',
  },
  {
    id: '000000002',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: '你推荐的 曲妮妮 已通过第三轮面试',
    datetime: '2017-08-08',
    type: 'notification',
  },
  {
    id: '000000003',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    title: '这种模板可以区分多种通知类型',
    datetime: '2017-08-07',
    read: true,
    type: 'notification',
  },
  {
    id: '000000004',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    title: '左侧图标用于区分不同的类型',
    datetime: '2017-08-07',
    type: 'notification',
  },

];
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
              // theme='light'
              // style={{ height: '100vh', background: '#3f4d67', boxShadow: '3px 0px 15px 2px #8c8c8c', position: 'fixed', left: 0, overflow: 'auto', }}
              style={{ height: '100vh', position: 'fixed', right: 0, overflow: 'auto', }}
            >
              <div className="logo">
                <img style={{ width: '100%', maxWidth: '150px', height: '120px' }} src={Logo} />
                <br />

                <Text style={{ color: '#fff' }}></Text>


              </div>
              <SiderNavigation />

            </Sider>

            <Layout className="site-layout" style={{ marginRight: "15%", minHeight: '100vh' }}>

              <Header style={{ background: '#F0F2F5', width: '100%' }}>

                <Row>

                  <Col align="left" span={24}>




                    <Dropdown overlay={
                      <Menu style={{ marginTop: 10 }}>
                        <Menu.Item key="1" onClick={props.logout}>
                          <LogoutOutlined />
                        تسجيل الخروج
                        </Menu.Item>
                        <Menu.Item key="2" >
                          <Link to={`/settings`}>
                            <SettingOutlined style={{ marginLeft: 8, marginRight: 0 }} />
                            الاعدادات
                          </Link>
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