import React from 'react';
import './MessageHistory.css';
import { Col, Typography, Space, Card, message, Empty } from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { Helmet } from 'react-helmet';

const { REACT_APP_NAME: APP_NAME } = process.env;

const MessageHistory = () => {
  const account = JSON.parse(localStorage.getItem('account'));
  const [loading, setLoading] = React.useState(false);
  const [msgHistory, setMsgHistory] = React.useState([]);
  const renderTimestampText = (scheduled_at) => {
    const readableTime = moment(scheduled_at).format('MMM Do, YYYY [@] h:mm A');
    if (moment(scheduled_at).isBefore(moment())) {
      return `Sent on ${readableTime}`;
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
        collection(db, `${account.id}/history`),
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
  }, [account.id]);
  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div>
      <Helmet>
        <title>Message History | {APP_NAME}</title>
        <meta name="description" content="View your message history" />
      </Helmet>
      <HeaderBar title="Message History" />
      <Col span={24} className="home-container">
        <Space direction="vertical" style={{ width: '100%' }}>
          {msgHistory.map((item) => (
            <Card
              hoverable={isFuture(item.scheduled_at)}
              className={isFuture(item.scheduled_at) ? 'future-message' : ''}
            >
              <Typography.Text className="message-content">
                {item.message}
              </Typography.Text>
              <br />
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
