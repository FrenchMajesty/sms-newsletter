import React from 'react';
import './Auth.css';
import { Input, Row, Col, Form, Button, Typography } from 'antd';
import { useNavigate, redirect } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const onSubmit = (values) => {
    console.log(values);
    //redirect('/code-verify');
    navigate('/code-verify');
  };

  // Create a memo to return morning, afternoon, evening, or night
  const hours = new Date().getHours();
  const getGreeting = React.useMemo(() => {
    if (hours < 12) {
      return 'morning';
    } else if (hours < 18) {
      return 'afternoon';
    } else if (hours < 22) {
      return 'evening';
    }

    return 'night';
  }, [hours]);

  return (
    <div>
      <Typography.Title level={1} className="center-text">
        SMS Newsletter
      </Typography.Title>
      <div className="welcome-msg">
        <Typography.Title level={3} className="center-text">
          Good {getGreeting},<br />
          Use your number to sign in
        </Typography.Title>
      </div>
      <Form onFinish={onSubmit}>
        <Row gutter={16} justify="center">
          <Col span={20}>
            <Form.Item
              label="Phone number"
              name="phone_number"
              required
              rules={[
                { required: true, message: 'Please input your phone number' },
              ]}
            >
              <Input placeholder="(900) 456-9090" size="large" maxLength={10} />
            </Form.Item>
          </Col>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Send code
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default Auth;
