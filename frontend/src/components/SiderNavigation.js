import React from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { DashboardFilled, IdcardFilled, DollarCircleFilled, CalendarFilled, MessageFilled, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import MediaQuery from 'react-responsive';
import RegisterDrawer from '../components/register/RegisterDrawer';


const SiderNavigation = withRouter((props) => {

   // get the basepath of the current url
   // to use as a selected key to correspond with the menu
   const selectedItem = `/${props.location.pathname.split('/')[1]}`;


   return (
      <Menu theme="dark" mode="inline" selectedKeys={[selectedItem]}>
         
         {props.role === 'dentalaide' ? null : (
            <Menu.Item key="/dashboard">
               <DashboardFilled />
               <span>Dashboard</span>
               <Link to="/dashboard"></Link>
            </Menu.Item>
         )}

         <Menu.Item key="/dentalrecords">
            <IdcardFilled />
            <span>Dental Records</span>
            <Link to="/dentalrecords"></Link>
         </Menu.Item>

         {props.role === 'dentalaide' ? null : (
            <Menu.Item key="/transactionlog">
               <DollarCircleFilled />
               <span>Transaction Log</span>
               <Link to="/transactionlog"></Link>
            </Menu.Item>
         )}

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

         {props.role === 'dentalaide' ? null : (
            <Menu.Item key="/useraccounts">
               <TeamOutlined />
               <span>User Accounts</span>
               <Link to="/useraccounts"></Link>
            </Menu.Item>
         )}

         <Menu theme="dark" mode="inline" selectedKeys={[selectedItem]}>
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

         <Menu.Item>
            <MediaQuery minWidth={900}>
               <RegisterDrawer />
            </MediaQuery>
         </Menu.Item>

      </Menu>
   );
});

export default SiderNavigation;