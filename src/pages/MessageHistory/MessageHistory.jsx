import React from 'react';
import './MessageHistory.css';
import { Col, Typography, Space, Card } from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';

const MessageHistory = () => {
  const renderTimestampText = (scheduled_at) => {
    const readableTime = moment(scheduled_at).format('MMM Do, YYYY [@] h:mm A');
    if (moment(scheduled_at).isBefore(moment())) {
      return `Sent at ${readableTime}`;
    }
    return `Scheduled for ${readableTime}`;
  };
  const isFuture = (scheduled_at) => {
    return moment(scheduled_at).isAfter(moment());
  };
  const data = [
    {
      id: 129,
      content:
        'This is another test message. I believe that I can fly and anything I set my mind to do, I can accomplish.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scheduled_at: moment().add(10, 'days').toISOString(),
    },
    {
      id: 129,
      content: 'This is a test message',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scheduled_at: new Date().toISOString(),
    },
  ];

  return (
    <div>
      <HeaderBar title="Message History" />
      <Col span={24} className="home-container">
        <Space direction="vertical">
          {data.map((item) => (
            <Card
              hoverable={isFuture(item.scheduled_at)}
              className={isFuture(item.scheduled_at) ? 'future-message' : ''}
            >
              <Typography.Title level={5}>{item.content}</Typography.Title>
              <Typography.Text type="secondary">
                {renderTimestampText(item.scheduled_at)}
              </Typography.Text>
            </Card>
          ))}
        </Space>
      </Col>
    </div>
  );
};

export default MessageHistory;
