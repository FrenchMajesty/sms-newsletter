import React from 'react';
import './EditSubscriber.css';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Space,
  message,
  Popconfirm,
} from 'antd';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  collection,
  query,
  doc,
  increment,
  limit,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { db } from 'lib/firebase';

const EditSubscriber = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const account = JSON.parse(localStorage.getItem('account'));
  const onFinish = async (values) => {
    try {
      values.phone_number = '+1' + values.phone_number.replace('+1', '');
      if (!(await validateNumberIsUnique(values.phone_number))) {
        message.error('This phone number is already registered');
        return;
      }
      if (!id) {
        await createSubscriber(values);
      } else {
        await updateSubscriber(values);
      }
      message.success(
        `Subscriber ${id ? 'updated' : 'created'} successfully`,
        2,
        () => {
          navigate('/subscribers');
        },
      );
    } catch (error) {
      console.log(error);
      message.error('Sorry, something went wrong :(');
    }
  };
  const updateSubscriber = (values) => {
    return updateDoc(doc(db, `${account.id}/subscribers`, id), {
      uid: id,
      name: values.name,
      phone_number: values.phone_number,
      updated_at: new Date().valueOf(),
    });
  };
  const createSubscriber = async (values) => {
    const ref = await addDoc(collection(db, `${account.id}/subscribers`), {
      name: values.name,
      phone_number: values.phone_number,
      created_at: new Date().valueOf(),
      updated_at: new Date().valueOf(),
    });
    updateDoc(doc(db, `${account.id}/subscribers`, ref.id), {
      uid: ref.id,
    });
    updateDoc(doc(db, account.id), {
      subscribers_count: increment(1),
    });
    return ref;
  };
  const validateNumberIsUnique = async (number) => {
    try {
      const q = query(
        collection(db, `${account.id}/subscribers`),
        where('uid', '!=', id || ''),
        where('phone_number', '==', number),
        limit(1),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size === 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const onDelete = async () => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, `${account.id}/subscribers`, id));
      setDeleting(false);
      message.success('Subscriber removed successfully');
      navigate('/subscribers');
    } catch (e) {
      console.log(e);
      setDeleting(false);
      message.error('Sorry, something went wrong :(');
    }
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
  const loadSubscriberDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, account.id, 'subscribers', id);
      const docSnap = await getDoc(docRef);
      const data = {
        id: '/' + docSnap.ref.path,
        uid: docSnap.id,
        ...docSnap.data(),
      };
      setLoading(false);
      form.setFieldsValue({
        name: data.name,
        phone_number: formatPhoneNumber(data.phone_number),
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error(
        'Sorry, something went wrong while loading this subscriber',
      );
      navigate('/subscribers');
    }
  }, [form, account.id, id, navigate]);
  const goBack = () => {
    navigate(-1);
  };
  React.useEffect(() => {
    if (id) {
      loadSubscriberDetails();
    }
  }, [id, loadSubscriberDetails]);

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
            <Form form={form} name="edit-subscriber" onFinish={onFinish}>
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
                name="phone_number"
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
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {id ? 'Update' : 'Add'}
                  </Button>
                  {id ? (
                    <Popconfirm
                      title={`Remove ${
                        form.getFieldValue('name') || 'Subscriber'
                      }`}
                      description="Are you sure to remove from your list?"
                      onConfirm={onDelete}
                      okText="Yes"
                      cancelText="No"
                      placement="bottom"
                    >
                      <Button danger loading={deleting}>
                        Remove
                      </Button>
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
