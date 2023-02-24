import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import React from 'react';
import './Landing.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const { REACT_APP_NAME: APP_NAME, REACT_APP_WAITLIST_FORM: WAITLIST_FORM } =
  process.env;

const Landing = () => {
  const smsPrice = 0.0074;
  const profitMargin = 1.2;
  const companyPrices = [
    {
      key: '1',
      name: '/images/slicktext.png',
      count: '9,000',
      price: '$350.00',
    },
    {
      key: '2',
      name: '/images/simpletexting.png',
      count: '9,000',
      price: '$399.99',
    },
    {
      key: '3',
      name: '/images/sakari.png',
      count: '9,000',
      price: '$330.99',
    },
    {
      key: '4',
      name: '/images/eztexting.jpg',
      count: '9,000',
      price: '$290.00',
    },
    {
      key: '5',
      name: 'Our Price',
      count: '9,000',
      price: `$${(smsPrice * profitMargin * 9000).toFixed(2)}`,
    },
  ];
  const messageCalculatorChoices = [100, 500, 1000, 10000, 100000, 1000000];
  const [msgCount, setMsgCount] = React.useState(1000);
  const renderCompanyCol = (text, record, index) => {
    if (index === companyPrices.length - 1) {
      return (
        <Typography.Title
          level={4}
          color="primary"
          style={{ color: 'green', fontWeight: 'bold' }}
        >
          {text}
        </Typography.Title>
      );
    }
    return <img className="competitor-logo" src={text} alt={`${text} Logo`} />;
  };
  const renderOtherCol = (text, record, index) => {
    if (index === companyPrices.length - 1) {
      return (
        <Typography.Title
          level={4}
          color="primary"
          style={{ color: 'green', fontWeight: 'bold' }}
        >
          {text}
        </Typography.Title>
      );
    }
    return text;
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>The simplest text newsletter | {APP_NAME}</title>
        <meta
          name="description"
          content={`${APP_NAME} is the simplest way to manage a text newsletter`}
        />
      </Helmet>
      <Row justify="center" className="hero-banner">
        <Space direction="vertical">
          <Typography.Title level={1}>
            The simplest texting platform 💬
          </Typography.Title>
          <Typography.Title level={3}>
            Message subscribers with scheduled texts,
            <br />
            at the lowest price
          </Typography.Title>
          <Space size={40}>
            <a href={WAITLIST_FORM}>
              <Button type="primary">Sign up now</Button>
            </a>
            <Link to="/login">
              <Button>I am a member</Button>
            </Link>
          </Space>
        </Space>
      </Row>
      <Space direction="vertical" size={30}>
        <Typography.Title level={2}>How it works</Typography.Title>
        <Row gutter={[16, 16]} justify="space-around">
          <Col md={6}>
            <Typography.Title level={4}>Add subscribers</Typography.Title>
            <Typography.Paragraph>
              Manage your subscribers from a simple list
            </Typography.Paragraph>
          </Col>
          <Col md={6}>
            <Typography.Title level={4}>Schedule messages</Typography.Title>
            <Typography.Paragraph>
              You can schedule messages to be sent at a specific time
            </Typography.Paragraph>
          </Col>
          <Col md={6}>
            <Typography.Title level={4}>Reach people</Typography.Title>
            <Typography.Paragraph>
              Connect with your audience with a timely, personal message
            </Typography.Paragraph>
          </Col>
        </Row>

        <div>
          <Typography.Title level={2}>Why I built this</Typography.Title>
          <Typography.Text>
            I wanted a simple solution to send mass texts for my church's
            ministry.
          </Typography.Text>
          <br />
          <Typography.Text>
            I found that most solutions were too expensive or too complicated.
          </Typography.Text>
        </div>
        <Row justify="center">
          <Col span={12}>
            <Table
              pagination={false}
              columns={[
                {
                  title: 'Company',
                  dataIndex: 'name',
                  key: 'name',
                  render: renderCompanyCol,
                },
                {
                  title: 'Messages/month',
                  dataIndex: 'count',
                  key: 'count',
                  responsive: ['md'],
                  render: renderOtherCol,
                },
                {
                  title: 'Price/month',
                  dataIndex: 'price',
                  key: 'price',
                  render: renderOtherCol,
                },
              ]}
              dataSource={companyPrices}
            />
            <br />
            <Typography.Paragraph>
              {APP_NAME} is over <span className="emphasis">3x cheaper</span>{' '}
              than the competition because we don't have fancy bells or
              whistles. We just want to help you reach people.
            </Typography.Paragraph>
          </Col>
        </Row>
        <Typography.Title level={2}>Billing calculator</Typography.Title>
        <Row justify="center">
          <Col span={7}>
            <Typography.Paragraph>
              It cost ${smsPrice}/text, and we charge a 20% profit margin on top
              of it for maintenance. <br /> You can use this form to estimate
              your cost.
            </Typography.Paragraph>
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Form layout="vertical">
              <Form.Item
                label="Number of messages"
                name="messages"
                className="form-input"
                initialValue={msgCount}
              >
                <Select
                  placeholder="10,000"
                  value={msgCount}
                  onSelect={(count) => setMsgCount(count)}
                >
                  {messageCalculatorChoices.map((choice) => (
                    <Select.Option value={choice}>
                      {choice.toLocaleString()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Monthly bill">
                <Input
                  value={`$${(
                    msgCount *
                    smsPrice *
                    profitMargin
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  disabled
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Typography.Title level={2}>
          Interested ? Join waitlist
        </Typography.Title>
        <a href={WAITLIST_FORM}>
          <Button size="large" type="primary">
            Sign up now
          </Button>
        </a>
      </Space>
    </div>
  );
};

export default Landing;
