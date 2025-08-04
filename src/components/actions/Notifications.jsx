import React, { useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const defaultNotifications = [
  {
    text: 'Sara Crouch liked your photo',
    icon: 'icofont-heart',
    time: '17 minutes ago'
  },
  {
    text: 'New user registered',
    icon: 'icofont-users-alt-6',
    time: '23 minutes ago'
  },
  {
    text: 'Amanda Lie shared your post',
    icon: 'icofont-share',
    time: '25 minutes ago'
  },
  {
    text: 'New user registered',
    icon: 'icofont-users-alt-6',
    time: '32 minutes ago'
  },
  {
    text: 'You have a new message',
    icon: 'icofont-ui-message',
    time: '58 minutes ago'
  }
];



const homeRoute = 'default-dashboard';

const Notifications = ({ data = defaultNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const handleClearAll = () => setNotifications([]);

  const createNotificationMenuItems = () => {
    const items = [
      {
        key: 'header',
        type: 'group',
        label: (
          <span className='dropdown-header'>
            <h3 className='dropdown-title'>Notifications</h3>
            <a onClick={handleClearAll} className='text-danger'>
              Clear all
            </a>
          </span>
        ),
      },
    ];

    if (notifications.length) {
      const notificationItems = notifications.map((item, index) => ({
        key: index,
        label: (
          <NavLink className='d-flex w-100' to={homeRoute}>
            <span className={`icon mr-3 ${item.icon}`} />
            <span className='text'>
              <span className='message'>{item.text}</span>
              <span className='sub-text'>{item.time}</span>
            </span>
          </NavLink>
        ),
      }));
      items.push(...notificationItems);

      items.push({
        key: 'actions',
        type: 'group',
        label: (
          <div className='dropdown-actions'>
            <Button type='primary' className='w-100'>
              View all notifications
              <span
                style={{ fontSize: '1.2rem' }}
                className='icofont-calendar ml-3'
              />
            </Button>
          </div>
        ),
      });
    } else {
      items.push({
        key: 'empty',
        label: <span className='empty-item'>No notifications</span>,
      });
    }

    return items;
  };

  return (
    <Dropdown
      className='mr-3'
      menu={{
        items: createNotificationMenuItems(),
        className: 'action-menu',
        style: { minWidth: '280px' },
      }}
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
      placement='bottomRight'
    >
      <Badge className='action-badge' count={notifications.length}>
        <span
          className={`notification-icon icofont-notification ${visible ? 'active' : null
            }`}
          style={{ fontSize: '22px', cursor: 'pointer' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default Notifications;
