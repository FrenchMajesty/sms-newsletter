// Create a new page in src/pages/SubscriberList/SubscriberList.jsx similar to Home.jsx
import React from 'react';
import './SubscriberList.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Space,
  DatePicker,
  TimePicker,
  message,
  List,
} from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';

const SubscriberList = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const onSearchChange = (e) => {
    // TODO: Debounce this
    triggerSearch(e.target.value);
  };
  const triggerSearch = (term) => {
    term = term.trim();
    if (term.length < 2) return;
    console.log('run a search:', term);
  };
  const fetchSubscribers = React.useCallback(async () => {
    try {
      setLoading(true);
      //  TODO: Remove hardcoded account ID
      const q = query(
        collection(db, '/Accounts/JQ2U2j0TF7okzqqZOy4I/subscribers'),
        orderBy('created_at', 'desc'),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setData(data);
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, []);
  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  };
  React.useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return (
    <div>
      <HeaderBar title="Subscriber List" />
      <Col span={24} className="home-container">
        <Row gutter={16}>
          <Col span={24}>
            <Input.Search
              placeholder="Search by name or number"
              size="large"
              loading={false}
              onChange={onSearchChange}
              onSearch={triggerSearch}
            />
          </Col>
        </Row>
        <Space style={{ marginTop: 16, marginBottom: 16 }}>
          <Link to="/subscribers/add">
            <Button>Add</Button>
          </Link>
        </Space>
        <List
          itemLayout="horizontal"
          dataSource={data}
          loading={loading}
          className="subscriber-list"
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Link to={`/subscribers/${item.id}`}>{item.name}</Link>}
                description={`${formatPhoneNumber(
                  item.phone_number,
                )} - Added ${moment(item.created_at).format('MMM Do, YYYY')}`}
              />
            </List.Item>
          )}
        />
      </Col>
    </div>
  );
};

export default SubscriberList;
