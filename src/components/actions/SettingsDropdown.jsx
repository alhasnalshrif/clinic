import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const accountItems = [
  { text: 'Edit account', icon: 'icofont-ui-home', route: '/vertical/edit-account' },
  { text: 'User profile', icon: 'icofont-ui-user', route: '/vertical/user-profile' },
  { text: 'Calendar', icon: 'icofont-ui-calendar', route: '/vertical/events-calendar' },
  { text: 'Settings', icon: 'icofont-ui-settings', route: '/vertical/settings' },
  { text: 'Log Out', icon: 'icofont-logout', route: '/public/sign-in' }
];

const SettingsDropdown = () => {
  const accountMenuItems = accountItems.map((item, index) => ({
    key: index,
    label: (
      <NavLink className='d-flex w-100' to={item.route} replace>
        <span className={`icon mr-3 ${item.icon}`} />
        <span className='text'>{item.text}</span>
      </NavLink>
    ),
  }));

  return (
    <Dropdown 
      menu={{ 
        items: accountMenuItems, 
        style: { minWidth: '180px' } 
      }} 
      trigger={['click']} 
      placement='bottomRight'
    >
      <div className='item'>
        <Avatar
          size={40}
          className='mr-1'
          src={`${window.location.origin}/content/user-40-2.jpg`}
        />
        <span className='icofont-simple-down' />
      </div>
    </Dropdown>
  );
};

export default SettingsDropdown;
