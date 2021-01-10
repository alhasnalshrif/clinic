import React from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { DashboardFilled, IdcardFilled, DollarCircleFilled, CalendarFilled, MessageFilled, TeamOutlined, HomeOutlined } from '@ant-design/icons';


const SiderNavigation = withRouter((props) => {

   // get the basepath of the current url
   // to use as a selected key to correspond with the menu
   const selectedItem = `/${props.location.pathname.split('/')[1]}`;


   return (
      // <Menu style={{ background: '#3f4d67', color: '#a9b7d0', }}  mode="inline" selectedKeys={[selectedItem]}>
      <Menu theme='dark'  mode="inline" selectedKeys={[selectedItem]}>


         <Menu.Item key="/">
            <DashboardFilled />
            <span>Dashboard</span>
            <Link to="/"></Link>
         </Menu.Item>


         <Menu.Item key="/dentalrecords">
            <IdcardFilled />
            <span>Dental Records</span>
            <Link to="/dentalrecords"></Link>
         </Menu.Item>


         <Menu.Item key="/transactionlog">
            <DollarCircleFilled />
            <span>Transaction Log</span>
            <Link to="/transactionlog"></Link>
         </Menu.Item>


         <Menu.Item key="/appointments">
            <CalendarFilled />
            <span>Appointments</span>
            <Link to="/appointments"></Link>
         </Menu.Item>

         <Menu.Item key="/sms">
            <MessageFilled />
            <span>SMS</span>
            <Link to="/sms"></Link>
         </Menu.Item>


         <Menu.Item key="/useraccounts">
            <TeamOutlined />
            <span>User Accounts</span>
            <Link to="/useraccounts"></Link>
         </Menu.Item>

         <Menu.Item key="/home">
            <HomeOutlined />
            <span>Home</span>
            <Link to="/home"></Link>
         </Menu.Item>

         <Menu.Item key="/settings">
            {/* <Icon type="user" /> */}
            <span>Account Settings</span>
            <Link to="/settings"></Link>
         </Menu.Item>


   
      </Menu>
   );
});

export default SiderNavigation;