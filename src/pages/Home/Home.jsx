import React from 'react';
import './Home.css';
import { Input, Row, Col, Form , Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { Link } from 'react-router-dom';

const Home = () => {
    const onSubmit = (values) => {
        console.log(values)
    };
    // Write function to go back to previous page
    const goBack = () => {
        console.log('go back')
    }

    return (
        <div>
            <HeaderBar />
            <Col span={24} className="home-container">
                <Row gutter={16}>
                    <Typography.Title level={3}>Messages</Typography.Title>
                    <Col span={24} className='message-box'>
                        <div className='center-text'>
                            <Typography.Text>No message scheduled</Typography.Text>
                        </div>
                    </Col>
                    <Space style={{ marginTop: 16 }}>
                        <Link to="/message"><Button type="primary">Schedule</Button></Link>
                        
                        <Button>View history</Button>
                    </Space>
                </Row>
                <Row gutter={16} style={{ marginTop: 24 }}>
                    <Typography.Title level={3}>Subscribers</Typography.Title>
                    <Col span={24} className='recent-subs'>
                        <div className='empty-list center-text'>
                            <Typography.Text>No recent subscribers</Typography.Text>
                        </div>
                    </Col>
                    <Space style={{ marginTop: 16 }}>
                        <Button type="primary">Add</Button>
                        <Link to="/subscribers">
                            <Button>View all</Button>
                        </Link>
                    </Space>
                </Row>
            </Col>
        </div>
    );
}

export default Home;
