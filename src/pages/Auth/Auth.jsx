import React from 'react';
import './Auth.css';
import { Input, Row, Col, Form, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from 'lib/firebase';

const Auth = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const onSignInSubmit = async (values) => {
    const phone_number =
      '+1' + values.phone_number.replace('+1', '').replace(/\D/g, '');
    const appVerifier = window.recaptchaVerifier;
    try {
      setLoading(true);
      const result = await signInWithPhoneNumber(
        auth,
        phone_number,
        appVerifier,
      );
      window.confirmationResult = result;
      setLoading(false);
      navigate('/code-verify');
    } catch (error) {
      console.log('Failed to sign in', error);
      setLoading(false);
      message.error(
        'Error while sending SMS. Please check your number and try again.',
      );
    }
  };
  const initAuth = React.useCallback(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response) => {
          onSignInSubmit(form.getFieldsValue());
        },
      },
      auth,
    );
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
      setReady(true);
    });
  }, []);
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
  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div>
      <Typography.Title
        level={1}
        className="center-text"
        style={{ marginTop: 32 }}
      >
        SMS Newsletter
      </Typography.Title>
      <div className="welcome-msg">
        <Typography.Title level={3} className="center-text">
          Good {getGreeting},<br />
          Use your number to sign in
        </Typography.Title>
      </div>
      <Form form={form} disabled={!ready}>
        <Row gutter={0} justify="center" style={{ margin: 0 }}>
          <Col span={20}>
            <Form.Item
              label="Phone number"
              name="phone_number"
              required
              rules={[
                { required: true, message: 'Please enter your phone number' },
              ]}
            >
              <Input placeholder="(900) 456-9090" size="large" maxLength={17} />
            </Form.Item>
          </Col>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button
              id="sign-in-button"
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!ready}
            >
              Send code
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default Auth;
