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

const EditMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
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
  // Write function to go back to previous page
  const goBack = () => {
    console.log('go back');
  };
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };
  const data = {
    id: 129,
    message: 'Hello, this is a test message',
    scheduled_at: new Date().toISOString(),
  };

  return (
    <div>
      {contextHolder}
      <HeaderBar title={`${data.id ? 'Edit' : 'Schedule'} Message`} />
      <Col span={24} className="home-container">
        <Form onFinish={onSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Message"
                name="message"
                required
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
                  {data.id ? 'Update' : 'Schedule'}
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
