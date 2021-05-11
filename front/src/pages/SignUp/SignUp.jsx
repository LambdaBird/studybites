import React from 'react';
import {
  Button, Col, Form, Input, Row, Typography,
} from 'antd';

const { Title } = Typography;

const SignUp = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col type="flex" align="middle">
        <Title level={2}>
          Welcome
        </Title>
        <Form
          style={{
            width: '250px',
          }}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input placeholder="First name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input placeholder="Last name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Incorrect email',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="*********" />
          </Form.Item>

          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              SignUp
            </Button>
          </Form.Item>
        </Form>
      </Col>

    </Row>

  );
};

export default SignUp;
