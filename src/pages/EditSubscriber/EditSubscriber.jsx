import React from 'react';
import './EditSubscriber.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Space,
  message,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const EditSubscriber = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      if (!(await validateNumberIsUnique(values.number))) return;
      message.success('Subscriber updated successfully');
      //navigate('/subscribers');
    } catch (error) {
      console.log(error);
      message.error('Sorry, something went wrong :(');
    }
  };
  const validateNumberIsUnique = async (number) => {
    // TODO: Check Firestore
    return false;
  };
  const onDelete = () => {
    console.log('Delete user with ID:', data.id);
    message.success('Subscriber removed successfully');
    navigate('/subscribers');
  };
  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  };
  const goBack = () => {
    navigate(-1);
  };
  const data = {
    id: 129,
    name: 'John Doe',
    number: '+11234445050',
    created_at: new Date().toISOString(),
  };

  return (
    <div>
      <HeaderBar title={`${id ? 'Edit' : 'Add'} Subscriber`} />
      <Row style={{ padding: 10 }}>
        <Button onClick={goBack} icon={<ArrowLeftOutlined />}>
          Go back
        </Button>
      </Row>
      <Col span={24} className="home-container">
        <Row gutter={16}>
          <Col span={24}>
            <Form
              form={form}
              name="edit-subscriber"
              onFinish={onFinish}
              initialValues={
                id && data
                  ? {
                      name: data.name,
                      number: formatPhoneNumber(data.number),
                    }
                  : null
              }
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'A name is required' },
                  { min: 3, message: 'Name must be at least 3 characters' },
                  { max: 50, message: 'Name must be less than 50 characters' },
                ]}
              >
                <Input maxLength={50} />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="number"
                rules={[
                  { required: true, message: 'Phone number is required' },
                  {
                    max: 17,
                    message: 'Phone number must be less than 17 characters',
                  },
                ]}
              >
                <Input maxLength={17} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {id ? 'Update' : 'Add'}
                  </Button>
                  {id ? (
                    <Popconfirm
                      title={`Remove ${data.name}`}
                      description="Are you sure to remove from your list?"
                      onConfirm={onDelete}
                      okText="Yes"
                      cancelText="No"
                      placement="bottom"
                    >
                      <Button danger>Remove</Button>
                    </Popconfirm>
                  ) : null}
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default EditSubscriber;
