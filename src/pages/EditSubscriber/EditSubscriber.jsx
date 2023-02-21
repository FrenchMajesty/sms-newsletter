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
import algoliasearch from 'algoliasearch';
import { db } from 'lib/firebase';
import { Helmet } from 'react-helmet';

const {
  REACT_APP_ALGOLIA_APP_ID,
  REACT_APP_ALGOLIA_CRUD_KEY,
  REACT_APP_ALGOLIA_INDEX,
  REACT_APP_NAME: APP_NAME,
} = process.env;
const algoliaClient = algoliasearch(
  REACT_APP_ALGOLIA_APP_ID,
  REACT_APP_ALGOLIA_CRUD_KEY,
);
const index = algoliaClient.initIndex(REACT_APP_ALGOLIA_INDEX);

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
      if (!validatePhoneNumber(values.phone_number)) {
        message.error('Please enter a valid phone number');
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
  const validatePhoneNumber = (number) => {
    const phone_number = number.replace('+1', '').replace(/\D/g, '');
    return phone_number.length === 10;
  };
  const updateSubscriber = async (values) => {
    const data = {
      uid: id,
      name: values.name,
      phone_number: values.phone_number,
      updated_at: new Date().valueOf(),
    };
    await updateDoc(doc(db, `${account.id}/subscribers`, id), data);
    return index
      .partialUpdateObject({
        objectID: id,
        ...data,
      })
      .wait();
  };
  const createSubscriber = async (values) => {
    const data = {
      name: values.name,
      phone_number: values.phone_number,
      created_at: new Date().valueOf(),
      updated_at: new Date().valueOf(),
    };
    const ref = await addDoc(collection(db, `${account.id}/subscribers`), data);
    const setUid = updateDoc(doc(db, `${account.id}/subscribers`, ref.id), {
      uid: ref.id,
    });
    const updateCount = updateDoc(doc(db, account.id), {
      subscribers_count: increment(1),
    });
    const createAlgoliaObject = index
      .saveObject({
        objectID: ref.id,
        id: '/' + ref.path,
        uid: ref.id,
        account_id: account.id,
        ...data,
      })
      .wait();
    return Promise.all([setUid, updateCount, createAlgoliaObject]);
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
      await index.deleteObject(id);
      await deleteDoc(doc(db, `${account.id}/subscribers`, id));
      await updateDoc(doc(db, account.id), {
        subscribers_count: increment(-1),
      });
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
      <Helmet>
        <title>
          {id ? 'Edit' : 'Add'} Subscriber | {APP_NAME}
        </title>
        <meta
          name="description"
          content="Add or edit a subscriber to your newsletter"
        />
      </Helmet>
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
                        '"' + form.getFieldValue('name') + '"' || 'Subscriber'
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
