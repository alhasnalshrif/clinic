import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { DashboardFilled, IdcardFilled, DollarCircleFilled, CalendarFilled, MessageFilled, TeamOutlined, HomeOutlined } from '@ant-design/icons';


const SiderNavigation = () => {
   const location = useLocation();
   const selectedItem = `/${location.pathname.split('/')[1]}`;

   const menuItems = [
      {
         key: '/',
         icon: <DashboardFilled />,
         label: (
            <Link to="/">
               <span>بيانات العياده</span>
            </Link>
         ),
      },
      {
         key: '/home',
         icon: <HomeOutlined />,
         label: (
            <Link to="/home">
               <span>الاستقبال</span>
            </Link>
         ),
      },
      {
         key: '/dentalrecords',
         icon: <IdcardFilled />,
         label: (
            <Link to="/dentalrecords">
               <span>المرضي</span>
            </Link>
         ),
      },
      {
         key: '/transactionlog',
         icon: <DollarCircleFilled />,
         label: (
            <Link to="/transactionlog">
               <span>سجل المعاملات</span>
            </Link>
         ),
      },
      {
         key: '/appointments',
         icon: <CalendarFilled />,
         label: (
            <Link to="/appointments">
               <span>الحجوزات</span>
            </Link>
         ),
      },
      {
         key: '/sms',
         icon: <MessageFilled />,
         label: (
            <Link to="/sms">
               <span>الرسائل</span>
            </Link>
         ),
      },
      {
         key: '/useraccounts',
         icon: <TeamOutlined />,
         label: (
            <Link to="/useraccounts">
               <span>المستخدمين</span>
            </Link>
         ),
      },
   ];

   return (
      <Menu 
         theme='dark' 
         mode="inline" 
         selectedKeys={[selectedItem]}
         items={menuItems}
      />
   );
};

export default SiderNavigation;