import React from 'react';
import './Auth.css';
import { Input, Row, Col, Form, Button, Typography, message } from 'antd';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from 'lib/firebase';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

const { REACT_APP_NAME: APP_NAME, REACT_APP_WAITLIST_FORM: WAITLIST_FORM } =
  process.env;

const Auth = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [numberRegistered, setNumberRegistered] = React.useState(false);
  const checkIfUserExists = async (phoneNumber) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'Accounts'),
          where('phone_number', '==', phoneNumber),
        ),
      );
      return !querySnapshot.empty;
    } catch (e) {
      return false;
    }
  };
  const validatePhoneNumber = (number) => {
    const phone_number = number.replace('+1', '').replace(/\D/g, '');
    return phone_number.length === 10;
  };
  const onSignInSubmit = async (values) => {
    let { phone_number } = values;
    phone_number = '+1' + phone_number.replace('+1', '').replace(/\D/g, '');
    if (!validatePhoneNumber(phone_number)) {
      message.error('Invalid phone number. Please try again.');
      return;
    }
    const appVerifier = window.recaptchaVerifier;
    try {
      setLoading(true);
      const userExists = await checkIfUserExists(phone_number);
      if (!userExists) {
        message.error(
          'This phone number is not registered. Please sign up first.',
          2,
          () => window.location.replace(WAITLIST_FORM),
        );
        setLoading(false);
        return;
      }
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
      <Helmet>
        <title>Login | {APP_NAME}</title>
        <meta name="description" content="Login to your account" />
      </Helmet>
      <Typography.Title
        level={1}
        className="center-text"
        style={{ marginTop: 32 }}
      >
        {APP_NAME}
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
