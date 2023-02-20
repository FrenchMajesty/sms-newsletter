import React from 'react';
import { Row, Col, Typography } from 'antd';
import DrawerMenu from 'components/DrawerMenu/DrawerMenu';
import './HeaderBar.css';

const HeaderBar = ({ title = 'Welcome, John' }) => {

    return (
        <header className='header-bar'>
            <Row align="middle" justify="space-between">
                <Col span={4}>
                    <DrawerMenu />
                </Col>
                <Typography.Title level={3} style={{ margin: 0}}>{title}</Typography.Title>
                <Col span={4}></Col>
            </Row>
        </header>
    );
}

export default HeaderBar;
