import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Badge, Typography, Divider } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    BarChartOutlined,
    HomeOutlined,
    CalendarFilled,
    MedicineBoxOutlined,
    HeartOutlined,
    DollarCircleFilled,
    FileTextOutlined,
    MessageFilled,
    TeamOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../config/app';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: (
                <div className="user-menu-item">
                    <UserOutlined />
                    <span>الملف الشخصي</span>
                </div>
            ),
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            label: (
                <div className="user-menu-item">
                    <SettingOutlined />
                    <span>الإعدادات</span>
                </div>
            ),
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: (
                <div className="user-menu-item">
                    <LogoutOutlined />
                    <span style={{ color: 'var(--error-color)' }}>تسجيل الخروج</span>
                </div>
            ),
            onClick: handleLogout
        }
    ];

    const menuItems = [
        {
            key: '/',
            icon: <BarChartOutlined />,
            label: (
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>لوحة التحكم</span>
                </Link>
            ),
        },
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: (
                <Link to="/home" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>الاستقبال</span>
                </Link>
            ),
        },
        {
            key: '/appointments',
            icon: <CalendarFilled />,
            label: (
                <Link to="/appointments" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>إدارة المواعيد</span>
                </Link>
            ),
        },
        {
            key: '/medical-history',
            icon: <MedicineBoxOutlined />,
            label: (
                <Link to="/medical-history" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>السجلات الطبية</span>
                </Link>
            ),
        },
        {
            key: '/patients',
            icon: <UserOutlined />,
            label: (
                <Link to="/dentalrecords" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>المرضى</span>
                </Link>
            ),
        },
        {
            key: '/treatments',
            icon: <HeartOutlined />,
            label: (
                <Link to="/treatments" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>خطط العلاج</span>
                </Link>
            ),
        },
        {
            key: '/transactionlog',
            icon: <DollarCircleFilled />,
            label: (
                <Link to="/transactionlog" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>المدفوعات والفواتير</span>
                </Link>
            ),
        },
        {
            key: '/reports',
            icon: <FileTextOutlined />,
            label: (
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>التقارير</span>
                </Link>
            ),
        },
        {
            key: '/sms',
            icon: <MessageFilled />,
            label: (
                <Link to="/sms" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>الرسائل والتذكيرات</span>
                </Link>
            ),
        },
        {
            key: '/useraccounts',
            icon: <TeamOutlined />,
            label: (
                <Link to="/useraccounts" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 500 }}>إدارة المستخدمين</span>
                </Link>
            ),
        },
        // Add server config menu item only for desktop app
        ...(APP_CONFIG?.IS_ELECTRON ? [{
            key: '/server-config',
            icon: <SettingOutlined />,
            label: (
                <Link to="/server-config" style={{ textDecoration: 'none' }}>
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
        return ['/'];
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
                breakpoint="lg"
                onBreakpoint={(broken) => {
                    if (broken !== isMobile) {
                        setIsMobile(broken);
                        if (broken) setCollapsed(true);
                    }
                }}
                style={{
                    background: 'var(--bg-primary)',
                    borderRight: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: isMobile ? 1001 : 1,
                    position: isMobile ? 'fixed' : 'relative',
                    height: isMobile ? '100vh' : 'auto',
                }}
                width={280}
                collapsedWidth={isMobile ? 0 : 80}
            >
                {/* Logo Section */}
                <div style={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    position: 'relative'
                }}>
                    {!collapsed ? (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                            <Text 
                                style={{ 
                                    fontSize: 'var(--text-lg)', 
                                    fontWeight: 700,
                                    color: 'var(--primary-color)',
                                    display: 'block'
                                }}
                            >
                                نظام إدارة العيادة
                            </Text>
                            <Text 
                                style={{ 
                                    fontSize: 'var(--text-sm)', 
                                    color: 'var(--text-secondary)',
                                    display: 'block'
                                }}
                            >
                                Dental Management System
                            </Text>
                        </div>
                    ) : (
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--white)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'bold'
                        }}>
                            DMS
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div style={{ 
                    height: 'calc(100vh - 80px)', 
                    overflowY: 'auto',
                    padding: 'var(--spacing-2) 0'
                }}>
                    <Menu
                        mode="inline"
                        selectedKeys={getSelectedKeys()}
                        defaultOpenKeys={getOpenKeys()}
                        items={menuItems}
                        style={{ 
                            borderRight: 0, 
                            background: 'transparent',
                            fontSize: 'var(--text-sm)'
                        }}
                        inlineIndent={16}
                    />
                </div>

                {/* Mobile Overlay */}
                {isMobile && !collapsed && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                            zIndex: 999
                        }}
                        onClick={() => setCollapsed(true)}
                    />
                )}
            </Sider>
            
            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 0 : 0) }}>
                <Header style={{
                    padding: '0 var(--spacing-4)',
                    background: 'var(--bg-primary)',
                    borderBottom: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    height: 64
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ 
                                fontSize: '16px', 
                                width: 48, 
                                height: 48,
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-md)'
                            }}
                        />
                        
                        {/* Breadcrumb or Page Title could go here */}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                        {/* Notifications */}
                        <Button
                            type="text"
                            icon={
                                <Badge count={5} size="small">
                                    <BellOutlined style={{ fontSize: '18px', color: 'var(--text-secondary)' }} />
                                </Badge>
                            }
                            style={{ 
                                border: 'none',
                                width: 48, 
                                height: 48,
                                borderRadius: 'var(--radius-md)'
                            }}
                        />

                        <Divider type="vertical" style={{ height: 32, margin: 0 }} />

                        {/* User Menu */}
                        <Dropdown 
                            menu={{ items: userMenuItems }} 
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <div style={{ 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-3)',
                                padding: 'var(--spacing-2) var(--spacing-3)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Avatar 
                                    icon={<UserOutlined />} 
                                    style={{ 
                                        background: 'var(--primary-color)',
                                        border: '2px solid var(--primary-100)'
                                    }}
                                    size={36}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text strong style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                                        {user?.name || 'المستخدم'}
                                    </Text>
                                    <Text style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                                        {user?.role || 'طبيب أسنان'}
                                    </Text>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                
                <Content style={{
                    background: 'var(--bg-secondary)',
                    minHeight: 'calc(100vh - 64px)',
                    overflow: 'initial'
                }}>
                    <div style={{
                        padding: 'var(--spacing-6)',
                        maxWidth: '100%'
                    }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
            
            {/* Custom styles for user menu */}
            <style jsx>{`
                .user-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 0;
                }
            `}</style>
        </Layout>
    );
};

export default MainLayout;
