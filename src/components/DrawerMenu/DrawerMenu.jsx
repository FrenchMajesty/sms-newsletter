import React from 'react';
import './DrawerMenu.css';
import { Drawer, Button, Row, Space, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const DrawerMenu = () => {
  const [open, toggleOpen] = React.useState(false);
  const showDrawer = () => {
    toggleOpen(true);
  };

  const onClose = () => {
    toggleOpen(false);
  };
  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Scheduled Message', path: '/message/create' },
    { name: 'Message History', path: '/message/history' },
    { name: 'Subscribers', path: '/subscribers' },
    { name: 'Log Out', path: '/log-out' },
  ];

  return (
    <div>
      <MenuOutlined style={{ fontSize: '30px' }} onClick={showDrawer} />
      <Drawer
        title="Main Menu"
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        width={250}
      >
        <Space direction="vertical" size="large">
          {links.map((link, index) => (
            <Row key={index}>
              <Link to={link.path}>
                <Typography.Text strong className="menu-link">
                  {link.name}
                </Typography.Text>
              </Link>
            </Row>
          ))}
        </Space>
      </Drawer>
    </div>
  );
};

export default DrawerMenu;
