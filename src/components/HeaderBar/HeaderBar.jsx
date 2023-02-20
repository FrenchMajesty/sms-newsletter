import React from 'react';
import { Row, Col, Typography } from 'antd';
import DrawerMenu from 'components/DrawerMenu/DrawerMenu';
import './HeaderBar.css';

const HeaderBar = ({ title = '' }) => {
  const account = JSON.parse(localStorage.getItem('account'));
  const userName = account.name;
  const titleText = title || `Welcome, ${userName}`;

  return (
    <header className="header-bar">
      <Row align="middle" justify="space-between">
        <Col span={4}>
          <DrawerMenu />
        </Col>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {titleText}
        </Typography.Title>
        <Col span={4}></Col>
      </Row>
    </header>
  );
};

export default HeaderBar;
