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
  Select,
} from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { Helmet } from 'react-helmet';

const { REACT_APP_NAME: APP_NAME } = process.env;

const EditMessage = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [msg, setMessage] = React.useState(Object.create(null));
  const account = JSON.parse(localStorage.getItem('account'));
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    const { message, date, time } = values;
    const scheduledAt = moment(date.format('YYYY-MM-DD') + ' ' + time);
    if (moment().add(5, 'minutes').isAfter(scheduledAt)) {
      messageApi.error('Scheduled time must be at least 5 minutes from now');
      return;
    }

    try {
      setLoading(true);
      if (!isWithinUsageLimits()) {
        messageApi.error(
          'You have reached your monthly message limit. Upgrade your plan to send more messages.',
        );
        setLoading(false);
        return;
      }

      if (account.subscribers_count === 0) {
        messageApi.error('You have no subscribers to send messages to');
        setLoading(false);
        return;
      }

      const docRef = doc(db, account.id);
      const data = {
        message,
        method: values.method,
        scheduled_at: scheduledAt.valueOf(),
      };
      await updateDoc(docRef, {
        scheduled: data,
      });
      const updated = { ...account };
      updated.scheduled = data;
      localStorage.setItem('account', JSON.stringify(updated));
      setLoading(false);
      messageApi.success('Message scheduled successfully');
      navigate('/home');
    } catch (e) {
      console.log(e);
      setLoading(false);
      messageApi.error('Error scheduling message :(');
    }
  };
  const isWithinUsageLimits = () => {
    if (!account.msg_count) return false;
    const { max_monthly, current } = account.msg_count;
    const newTotal = current + account.subscribers_count;

    if (current >= max_monthly || newTotal >= max_monthly) {
      return false;
    }

    return true;
  };
  const fetchScheduledMessage = React.useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, account.id);
      const docSnap = await getDoc(docRef);
      const scheduledMsg = docSnap.data().scheduled || null;
      setLoading(false);
      if (scheduledMsg) {
        setMessage(scheduledMsg);
        form.setFieldsValue({
          message: scheduledMsg.message,
          date: dayjs(scheduledMsg.scheduled_at),
          method: scheduledMsg.method,
          time: dayjs(scheduledMsg.scheduled_at).format('HH:mm'), // TODO: BUGGED
        });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Error fetching subscribers list :(');
    }
  }, [form, account.id]);
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };
  React.useEffect(() => {
    fetchScheduledMessage();
  }, [fetchScheduledMessage]);

  return (
    <div>
      {contextHolder}
      <Helmet>
        <title>
          {msg ? 'Edit' : 'Schedule'} Message | {APP_NAME}
        </title>
        <meta
          name="description"
          content="Schedule or edit the next message to be sent out"
        />
      </Helmet>
      <HeaderBar title={`${msg ? 'Edit' : 'Schedule'} Message`} />
      <Col span={24} className="home-container">
        <Form form={form} onFinish={onSubmit} initialValues={{ method: 'sms' }}>
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
            <Col span={24}>
              <Form.Item
                label="Delivery method"
                name="method"
                required
                initialValue={msg ? msg.method : ''}
                rules={[{ required: true, message: 'Method is required' }]}
              >
                <Select
                  placeholder="Where the message will be delivered"
                  style={{ width: '100%' }}
                  options={[
                    { label: 'SMS', value: 'sms' },
                    /*{ label: 'WhatsApp', value: 'whats_app' }, TODO: Disable WhatsApp for now */
                  ]}
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
                ]}
              >
                <Input type="time" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
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
