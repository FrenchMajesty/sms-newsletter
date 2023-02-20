import React from 'react';
import './MessageHistory.css';
import { Col, Typography, Space, Card, message, Empty } from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';

const MessageHistory = () => {
  const accountId = '/Accounts/JQ2U2j0TF7okzqqZOy4I';
  const [loading, setLoading] = React.useState(false);
  const [msgHistory, setMsgHistory] = React.useState([]);
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
  const fetchHistory = React.useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, `${accountId}/history`),
        orderBy('scheduled_at', 'desc'),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: '/' + doc.ref.path,
        uid: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setMsgHistory(data);
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Error fetching message history');
    }
  }, []);
  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div>
      <HeaderBar title="Message History" />
      <Col span={24} className="home-container">
        <Space direction="vertical" style={{ width: '100%' }}>
          {msgHistory.map((item) => (
            <Card
              hoverable={isFuture(item.scheduled_at)}
              className={isFuture(item.scheduled_at) ? 'future-message' : ''}
            >
              <Typography.Title level={5}>{item.message}</Typography.Title>
              <Typography.Text type="secondary">
                {renderTimestampText(item.scheduled_at)}
              </Typography.Text>
            </Card>
          ))}
          {msgHistory.length === 0 && !loading ? (
            <Empty description="No messages have been sent yet" />
          ) : null}
        </Space>
      </Col>
    </div>
  );
};

export default MessageHistory;
