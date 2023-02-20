import React from 'react';
import './CodeVerify.css';
import { Input, Row, Col, Form , Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CodeVerify = () => {
    const navigate = useNavigate();
    const onSubmit = (values) => {
        console.log(values)
        navigate('/home');
    };
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <Typography.Title level={1} className='center-text'>SMS Newsletter</Typography.Title>
            <Row style={{ padding: 10 }}>
                <Button onClick={goBack} icon={<ArrowLeftOutlined />}>
                    Go back
                </Button>
            </Row>
            <Form onFinish={onSubmit} className="welcome-msg">
                <Row gutter={16} justify="center">
                    <Col span={20}>
                        <Form.Item label="PIN" name="pin" required 
                            rules={[
                                { required: true, message: 'Please enter the PIN' },
                                { len: 4, message: 'Please enter a 4-digit PIN' },
                            ]}
                        >
                            <Input placeholder="* * * *" size='large' maxLength={4} />
                        </Form.Item>
                    </Col>
                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Verify
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </div>
    );
}

export default CodeVerify;
