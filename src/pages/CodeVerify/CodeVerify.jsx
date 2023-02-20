import React from 'react';
import './CodeVerify.css';
import { Input, Row, Col, Form, Button, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db } from 'lib/firebase';
import {
  collection,
  query,
  doc,
  getDocs,
  updateDoc,
  where,
} from 'firebase/firestore';

const CodeVerify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const linkAuthToUserAccount = async (authId, phoneNumber) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'Accounts'),
          where('phone_number', '==', phoneNumber),
        ),
      );
      if (querySnapshot.empty) {
        throw new Error('No matching documents.');
      }
      const account = querySnapshot.docs[0].data();
      if (account.auth_id === authId) {
        return account; // already linked
      }
      const docRef = doc(db, account.id);
      await updateDoc(docRef, { auth_id: authId });
      account.auth_id = authId;
      account.login_at = new Date().valueOf();
      return account;
    } catch (e) {
      throw e;
    }
  };
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { user } = await window.confirmationResult.confirm(values.code);
      const account = await linkAuthToUserAccount(user.uid, user.phoneNumber);
      localStorage.setItem('account', JSON.stringify(account));
      setLoading(false);
      navigate('/home', { replace: true });
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error('Invalid code. Please try again.');
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Typography.Title
        level={1}
        className="center-text"
        style={{ marginTop: 32 }}
      >
        SMS Newsletter
      </Typography.Title>
      <Row style={{ padding: 10 }}>
        <Button onClick={goBack} icon={<ArrowLeftOutlined />}>
          Go back
        </Button>
      </Row>
      <Form onFinish={onSubmit} className="welcome-msg">
        <Row justify="center" style={{ margin: 0 }}>
          <Col span={20}>
            <Form.Item
              label="Code"
              name="code"
              required
              rules={[
                { required: true, message: 'Please enter the code' },
                { len: 6, message: 'Please enter a 6-digit code' },
              ]}
            >
              <Input placeholder="* * * * * *" size="large" maxLength={6} />
            </Form.Item>
          </Col>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Verify
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default CodeVerify;
