import React from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { DashboardFilled, IdcardFilled, DollarCircleFilled, CalendarFilled, MessageFilled, TeamOutlined, HomeOutlined } from '@ant-design/icons';


const SiderNavigation = withRouter((props) => {

  
   const selectedItem = `/${props.location.pathname.split('/')[1]}`;


   return (
      // <Menu style={{ background: '#3f4d67', color: '#a9b7d0', }}  mode="inline" selectedKeys={[selectedItem]}>
      <Menu theme='dark' mode="inline" selectedKeys={[selectedItem]}>


         <Menu.Item key="/">
            <DashboardFilled />
            <span>بيانات العياده</span>
            <Link to="/"></Link>
         </Menu.Item>


         <Menu.Item key="/home">
            <HomeOutlined />
            <span>الاستقبال</span>
            <Link to="/home"></Link>
         </Menu.Item>

         <Menu.Item key="/dentalrecords">
            <IdcardFilled />
            <span>المرضي</span>
            <Link to="/dentalrecords"></Link>
         </Menu.Item>


         <Menu.Item key="/transactionlog">
            <DollarCircleFilled />
            <span>سجل المعاملات</span>
            <Link to="/transactionlog"></Link>
         </Menu.Item>


         <Menu.Item key="/appointments">
            <CalendarFilled />
            <span>الحجوزات</span>
            <Link to="/appointments"></Link>
         </Menu.Item>

         <Menu.Item key="/sms">
            <MessageFilled />
            <span>الرسائل</span>
            <Link to="/sms"></Link>
         </Menu.Item>


         <Menu.Item key="/useraccounts">
            <TeamOutlined />
            <span>المستخدمين</span>
            <Link to="/useraccounts"></Link>
         </Menu.Item>


      </Menu>
   );
});

export default SiderNavigation;