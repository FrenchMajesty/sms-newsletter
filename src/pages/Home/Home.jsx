import React from 'react';
import './Home.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Space,
  List,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  collection,
  query,
  doc,
  orderBy,
  limit,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from 'lib/firebase';

const Home = () => {
  const [recentSubscribers, setRecentSubscribers] = React.useState([]);
  const [subscribersLoading, setSubscribersLoading] = React.useState(false);
  const [accountLoading, setAccountLoading] = React.useState(false);
  const [account, setAccount] = React.useState(Object.create(null));
  const accountId = '/Accounts/JQ2U2j0TF7okzqqZOy4I';
  const onSubmit = (values) => {
    console.log(values);
  };
  const fetchAccount = React.useCallback(async () => {
    try {
      setAccountLoading(true);
      const docRef = doc(db, accountId);
      const docSnap = await getDoc(docRef);
      const data = {
        id: '/' + docSnap.ref.path,
        uid: docSnap.id,
        ...docSnap.data(),
      };
      setAccountLoading(false);
      setAccount(data);
    } catch (e) {
      console.log(e);
      setAccountLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, []);
  const fetchSubscribers = React.useCallback(async () => {
    try {
      setSubscribersLoading(true);
      const q = query(
        collection(db, `${accountId}/subscribers`),
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
  // Write function to go back to previous page
  const goBack = () => {
    console.log('go back');
  };
  React.useEffect(() => {
    fetchSubscribers();
    fetchAccount();
  }, [fetchSubscribers, fetchAccount]);

  return (
    <div>
      <HeaderBar />
      <Col span={24} className="home-container">
        <Row gutter={16}>
          <Typography.Title level={3}>Messages</Typography.Title>
          <Col span={24} className="message-box">
            {account.scheduled ? (
              <Space direction="vertical">
                <Row>
                  <Typography.Text>{account.scheduled.message}</Typography.Text>
                </Row>
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
              <Button type="primary">Schedule</Button>
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
                      <Link to={`/subscribers/${item.id}`}>{item.name}</Link>
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
