import React from 'react';
import './Home.css';
import { Row, Col, Button, Typography, Space, List, message } from 'antd';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { startCase } from 'lodash';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';

const { REACT_APP_NAME: APP_NAME } = process.env;

const Home = () => {
  const [recentSubscribers, setRecentSubscribers] = React.useState([]);
  const [subscribersLoading, setSubscribersLoading] = React.useState(false);
  const account = JSON.parse(localStorage.getItem('account'));
  const fetchSubscribers = React.useCallback(async () => {
    try {
      setSubscribersLoading(true);
      const q = query(
        collection(db, `${account.id}/subscribers`),
        orderBy('created_at', 'desc'),
        limit(5),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: '/' + doc.ref.path,
        uid: doc.id,
        ...doc.data(),
      }));
      setSubscribersLoading(false);
      setRecentSubscribers(data);
    } catch (e) {
      console.log(e);
      setSubscribersLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, []);
  const deliveryMethod = React.useMemo(() => {
    if (!account.scheduled) {
      return '';
    }

    const { method } = account.scheduled;
    if (method === 'sms') {
      return 'SMS';
    } else {
      return startCase(method).replace(/\s/g, '');
    }
  }, [account.scheduled]);
  React.useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return (
    <div>
      <Helmet>
        <title>Home | {APP_NAME}</title>
        <meta
          name="description"
          content="Home page where you can manage everything about your newsletter"
        />
      </Helmet>
      <HeaderBar />
      <Col span={24} className="home-container">
        <Row gutter={16}>
          <Typography.Title level={3}>Messages</Typography.Title>
          <Col span={24} className="message-box">
            {account.scheduled ? (
              <Space direction="vertical">
                <div>
                  <Row>
                    <Typography.Text className="delivery-method">
                      {deliveryMethod}
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>
                      {account.scheduled.message}
                    </Typography.Text>
                  </Row>
                </div>
                <Row>
                  <Typography.Text type="secondary">
                    {moment(account.scheduled.scheduled_at).format(
                      'MMM Do, YYYY [@] h:mm A',
                    )}
                  </Typography.Text>
                </Row>
              </Space>
            ) : (
              <div className="center-text">
                <Typography.Text>No message scheduled</Typography.Text>
              </div>
            )}
          </Col>
          <Space style={{ marginTop: 16 }}>
            <Link to="/message/create">
              <Button type="primary">
                {account.scheduled ? 'Edit' : 'Schedule'}
              </Button>
            </Link>
            <Link to="/message/history">
              <Button>View history</Button>
            </Link>
          </Space>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Typography.Title level={3}>Subscribers</Typography.Title>
          <Col span={24}>
            <List
              itemLayout="horizontal"
              dataSource={recentSubscribers}
              loading={subscribersLoading}
              locale={{ emptyText: 'No recent subscribers' }}
              className="subscriber-list"
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link to={`/subscribers/${item.uid}`}>{item.name}</Link>
                    }
                    description={`Since ${moment(item.created_at).format(
                      'MMM Do, YYYY',
                    )}`}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Space style={{ marginTop: 16 }}>
            <Link to="/subscribers/add">
              <Button type="primary">Add</Button>
            </Link>
            <Link to="/subscribers">
              <Button>View all</Button>
            </Link>
          </Space>
        </Row>
      </Col>
    </div>
  );
};

export default Home;
