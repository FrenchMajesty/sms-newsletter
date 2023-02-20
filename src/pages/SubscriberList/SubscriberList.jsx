// Create a new page in src/pages/SubscriberList/SubscriberList.jsx similar to Home.jsx
import React from 'react';
import './SubscriberList.css';
import { Input, Row, Col, Form , Button, Typography, Space, DatePicker, TimePicker, message, List } from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate, Link } from 'react-router-dom';

const SubscriberList = () => {
    const onSearchChange = (e) => {
        // TODO: Debounce this
        triggerSearch(e.target.value);
    }
    const triggerSearch = (term) => {
        console.log('run a search:', term);
    } 
    const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            const intlCode = (match[1] ? '+1 ' : '');
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
        return null;
    };
    const data = [
        {
            id: 129,
            name: 'John Doe',
            number: '+11234445050',
            created_at: new Date().toISOString(),
        },
        {
            id: 999,
            name: 'John Doe',
            number: '+11234445050',
            created_at: new Date().toISOString(),
        },
        {
            id: 31123,
            name: 'John Doe',
            number: '+11234445050',
            created_at: new Date().toISOString(),
        },
    ];

    return (
        <div>
            <HeaderBar title='Subscriber List' />
            <Col span={24} className="home-container">
                <Row gutter={16}>
                    <Col span={24}>  
                        <Input.Search placeholder="Search by name or number" size="large" loading={false} onChange={onSearchChange} onSearch={triggerSearch} />
                    </Col>
                </Row>
                <Space style={{ marginTop: 16, marginBottom: 16 }}>
                    <Link to="/subscribers/add"><Button>Add</Button></Link>
                </Space>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    className="subscriber-list"
                    renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                        title={<Link to={`/subscribers/${item.id}`}>{item.name}</Link>}
                        description={`${formatPhoneNumber(item.number)} - Added ${moment(item.created_at).format('MMM Do, YYYY')}`}
                        />
                    </List.Item>
                    )}
                />
            </Col>
        </div>
    );
}

export default SubscriberList;
