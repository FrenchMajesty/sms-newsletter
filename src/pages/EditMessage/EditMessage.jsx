import React from 'react';
import './EditMessage.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  DatePicker,
  TimePicker,
  message,
} from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';

const EditMessage = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [msg, setMessage] = React.useState(Object.create(null));
  const accountId = '/Accounts/JQ2U2j0TF7okzqqZOy4I';
  const navigate = useNavigate();
  const onSubmit = (values) => {
    const { message, date, time } = values;
    const scheduledAt = moment(
      date.format('YYYY-MM-DD') + ' ' + time.format('hh:mm: A'),
    );
    if (moment().add(10, 'minutes').isAfter(scheduledAt)) {
      messageApi.error('Scheduled time must be at least 10 minutes from now');
      return;
    }

    console.log({ message, scheduledAt });
    messageApi.success('Message scheduled successfully', 3, openHome);
  };
  const openHome = () => {
    navigate('/home');
  };
  const fetchAccount = React.useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, accountId);
      const docSnap = await getDoc(docRef);
      setLoading(false);
      setMessage(docSnap.data().scheduled);
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, []);
  // Write function to go back to previous page
  const goBack = () => {
    console.log('go back');
  };
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };
  React.useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return (
    <div>
      {contextHolder}
      <HeaderBar title={`${msg.message ? 'Edit' : 'Schedule'} Message`} />
      <Col span={24} className="home-container">
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Message"
                name="message"
                required
                initialValue={msg ? msg.message : ''}
                rules={[
                  { required: true, message: 'Message is required' },
                  {
                    min: 10,
                    message: 'Message must be at least 10 characters',
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Write your message here..."
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                required
                initialValue={msg ? msg.scheduled_at : ''}
                rules={[
                  { required: true, message: 'Delivery date is required' },
                  { type: 'date', message: 'The date is incorrect' },
                ]}
              >
                <DatePicker
                  placeholder="February 12, 2023"
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Time"
                name="time"
                required
                initialValue={msg ? msg.scheduled_at : ''}
                rules={[
                  { required: true, message: 'Delivery time is required' },
                  { type: 'date', message: 'The time is incorrect' },
                ]}
              >
                <TimePicker
                  placeholder="7:30AM"
                  format="hh:mm A"
                  minuteStep={10}
                  use12Hours
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {msg.message ? 'Update' : 'Schedule'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </div>
  );
};

export default EditMessage;
