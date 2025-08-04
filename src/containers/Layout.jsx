import React, { useEffect } from "react";
import { Layout, Row, Col, Dropdown, Menu, Typography, Avatar } from "antd";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

// import { checkAuthenticated, load_user, logout } from "../redux";
import { load_user, logout } from "../redux";
import SiderNavigation from "./SiderNavigation";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logo from "./tothh.png";
import Login from "../pages/Login";
import Actions from "../components/actions/Actions";
import "./Layout.css";

const { Sider, Header } = Layout;
const { Text } = Typography;

const CustomLayout = (props) => {
  // const check = props.checkAuthenticated
  const load = props.load_user;
  useEffect(() => {
    const fetchData = async () => {
      // await check();
      await load();
    };
    fetchData();
  }, [load]);
  return (
    <>
      {props.isAuthenticated ? (
        <Layout className="layout">
          <Sider
            trigger={null}
            collapsed={0}
            breakpoint="lg"
            width="275px"
            style={{
              height: "100vh",
              position: "fixed",
              right: 0,
              overflow: "auto",
            }}
          >
            <div className="logo">
              <img
                style={{ width: "100%", maxWidth: "150px", height: "120px" }}
                src={Logo}
              />
              <br />

              <Text style={{ color: "#fff" }}></Text>
            </div>
            <SiderNavigation />
          </Sider>

          <Layout
            className="site-layout"
            style={{ marginRight: "275px", minHeight: "100vh" }}
          >
            <Header style={{ background: "#F0F2F5", width: "100%" }}>
              <Row>
                <Col align="left" span={24}>
                  <Dropdown
                    menu={{
                      style: { marginTop: 10 },
                      items: [
                        {
                          key: '1',
                          label: (
                            <Link to={`/settings`}>
                              <SettingOutlined
                                style={{ marginLeft: 8, marginRight: 0 }}
                              />
                              الاعدادات
                            </Link>
                          ),
                        },
                        {
                          key: '2',
                          label: (
                            <>
                              <LogoutOutlined />
                              تسجيل الخروج
                            </>
                          ),
                          onClick: props.logout,
                        },
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <a className="ant-dropdown-link">
                      <Avatar
                        style={{ backgroundColor: "#1890ff" }}
                        icon={<UserOutlined />}
                      />
                      {props.user == null ? (
                        <Text style={{ color: "#1890ff" }}> hey there </Text>
                      ) : (
                        <Text style={{ color: "#1890ff" }}>
                          {" "}
                          {props.user.username}{" "}
                        </Text>
                      )}
                    </a>
                  </Dropdown>

                  <Actions />
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

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { load_user, logout })(CustomLayout);
