import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    DashboardOulined,
    TeamOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
    FileTextOutlined,
    BankOutlined, BarChartOutlined, HomeOutlined, CalendarFilled, HeartOutlined, DollarCircleFilled, MessageFilled
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../config/app';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'الملف الشخصي',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            label: 'الإعدادات',
            icon: <SettingOutlined />,
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: 'تسجيل الخروج',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        }
    ];

    const menuItems = [
        {
            key: '/',
            icon: <BarChartOutlined />,
            label: (
                <Link to="/">
                    <span style={{ fontWeight: 500 }}>لوحة التحكم</span>
                </Link>
            ),
        },
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: (
                <Link to="/home">
                    <span style={{ fontWeight: 500 }}>الاستقبال</span>
                </Link>
            ),
        },
        {
            key: '/appointments',
            icon: <CalendarFilled />,
            label: (
                <Link to="/appointments">
                    <span style={{ fontWeight: 500 }}>إدارة المواعيد</span>
                </Link>
            ),
        },
        {
            key: '/medical-history',
            icon: <MedicineBoxOutlined />,
            label: (
                <Link to="/medical-history">
                    <span style={{ fontWeight: 500 }}>السجلات الطبية</span>
                </Link>
            ),
        },
        {
            key: '/patients',
            icon: <UserOutlined />,
            label: (
                <Link to="/dentalrecords">
                    <span style={{ fontWeight: 500 }}>المرضى</span>
                </Link>
            ),
        },
        {
            key: '/treatments',
            icon: <HeartOutlined />,
            label: (
                <Link to="/treatments">
                    <span style={{ fontWeight: 500 }}>خطط العلاج</span>
                </Link>
            ),
        },
        {
            key: '/transactionlog',
            icon: <DollarCircleFilled />,
            label: (
                <Link to="/transactionlog">
                    <span style={{ fontWeight: 500 }}>المدفوعات والفواتير</span>
                </Link>
            ),
        },
        {
            key: '/reports',
            icon: <FileTextOutlined />,
            label: (
                <Link to="/reports">
                    <span style={{ fontWeight: 500 }}>التقارير</span>
                </Link>
            ),
        },
        {
            key: '/sms',
            icon: <MessageFilled />,
            label: (
                <Link to="/sms">
                    <span style={{ fontWeight: 500 }}>الرسائل والتذكيرات</span>
                </Link>
            ),
        },
        {
            key: '/useraccounts',
            icon: <TeamOutlined />,
            label: (
                <Link to="/useraccounts">
                    <span style={{ fontWeight: 500 }}>إدارة المستخدمين</span>
                </Link>
            ),
        },
        // Add server config menu item only for desktop app
        ...(APP_CONFIG?.IS_ELECTRON ? [{
            key: '/server-config',
            //   icon: <ServerOutlined />,
            label: (
                <Link to="/server-config">
                    <span style={{ fontWeight: 500 }}>إعدادات الخادم</span>
                </Link>
            ),
        }] : []),
    ];

    const getSelectedKeys = () => {
        const path = location.pathname;
        // Check if current path matches any menu item
        for (const item of menuItems) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.key === path) {
                        return [child.key];
                    }
                }
            } else if (item.key === path) {
                return [item.key];
            }
        }
        return ['/dashboard'];
    };

    const getOpenKeys = () => {
        const path = location.pathname;
        const openKeys = [];

        for (const item of menuItems) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.key === path) {
                        openKeys.push(item.key);
                    }
                }
            }
        }
        return openKeys;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: '#fff',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ margin: 0, color: '#1890ff' }}>
                        {collapsed ? 'عيادة' : 'نظام إدارة العيادة'}
                    </h3>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKeys()}
                    defaultOpenKeys={getOpenKeys()}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>{user?.name || 'المستخدم'}</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{
                    margin: '16px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '6px',
                    minHeight: 280
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
