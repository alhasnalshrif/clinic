import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
   DashboardFilled, 
   IdcardFilled, 
   DollarCircleFilled, 
   CalendarFilled, 
   MessageFilled, 
   TeamOutlined, 
   HomeOutlined,
   MedicineBoxOutlined,
   FileTextOutlined,
   HeartOutlined,
   UserOutlined,
   SettingOutlined,
   BarChartOutlined,
   ServerOutlined
} from '@ant-design/icons';
import { APP_CONFIG } from '../config/app';


const SiderNavigation = () => {
   const location = useLocation();
   const selectedItem = `/${location.pathname.split('/')[1]}`;

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
         key: '/dentalrecords',
         icon: <MedicineBoxOutlined />,
         label: (
            <Link to="/dentalrecords">
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
      ...(APP_CONFIG.IS_ELECTRON ? [{
         key: '/server-config',
         icon: <ServerOutlined />,
         label: (
            <Link to="/server-config">
               <span style={{ fontWeight: 500 }}>إعدادات الخادم</span>
            </Link>
         ),
      }] : []),
   ];

   return (
      <Menu 
         theme='dark' 
         mode="inline" 
         selectedKeys={[selectedItem]}
         items={menuItems}
         style={{
            background: 'linear-gradient(180deg, #0D7377 0%, #14A085 100%)',
            border: 'none',
            fontSize: '14px'
         }}
      />
   );
};

export default SiderNavigation;