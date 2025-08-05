import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button, theme } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  BankOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  HeartOutlined,
  MessageOutlined,
  FileTextOutlined,
  BarChartOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from "../auth/AuthContext";
import { useLogout } from "../auth/hooks";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const StyledLogo = styled.div`
  height: 60px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  min-height: 280px;
  border-radius: 8px;
  overflow: auto;
`;

const CustomLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { logout, isLoggingOut } = useLogout();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      key: '/',
      icon: <BarChartOutlined />,
      label: 'لوحة التحكم',
      onClick: () => navigate('/'),
    },
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'الاستقبال',
      onClick: () => navigate('/home'),
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'إدارة المواعيد',
      onClick: () => navigate('/appointments'),
    },
    {
      key: '/medical-history',
      icon: <MedicineBoxOutlined />,
      label: 'السجلات الطبية',
      onClick: () => navigate('/medical-history'),
    },
    {
      key: '/dentalrecords',
      icon: <UserOutlined />,
      label: 'المرضى',
      onClick: () => navigate('/dentalrecords'),
    },
    {
      key: '/treatments',
      icon: <HeartOutlined />,
      label: 'خطط العلاج',
      onClick: () => navigate('/treatments'),
    },
    {
      key: '/transactionlog',
      icon: <BankOutlined />,
      label: 'المدفوعات والفواتير',
      onClick: () => navigate('/transactionlog'),
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'التقارير',
      onClick: () => navigate('/reports'),
    },
    {
      key: '/sms',
      icon: <MessageOutlined />,
      label: 'الرسائل والتذكيرات',
      onClick: () => navigate('/sms'),
    },
    {
      key: '/useraccounts',
      icon: <TeamOutlined />,
      label: 'إدارة المستخدمين',
      onClick: () => navigate('/useraccounts'),
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Link to="/settings">
              الاعدادات
            </Link>
          ),
          icon: <SettingOutlined />,
        },
        {
          key: '2',
          label: isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج',
          icon: <LogoutOutlined />,
          onClick: handleLogout,
          disabled: isLoggingOut,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={275}
        theme="dark"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          position: "fixed",
          right: 0,
          overflow: "auto",
        }}
      >
        <StyledLogo>
          Dental Clinic Aslhrif
        </StyledLogo>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginRight: collapsed ? "80px" : "275px" }}>
        <StyledHeader style={{ background: colorBgContainer }}>
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ marginRight: 16 }}
            />
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                />
                <span style={{ marginRight: 8, marginLeft: 8 }}>
                  {user?.firstName || user?.username || 'المستخدم'}
                </span>
              </div>
            </Dropdown>
          </div>
        </StyledHeader>
        <StyledContent
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
