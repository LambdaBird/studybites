import React from 'react';
import {
  Button, Col, Form, Input, Row, Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const SignUp = () => {
  const { t } = useTranslation();
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
          {t('general.welcome')}
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
                message: t('sign_up.first_name.error'),
              },
            ]}
          >
            <Input placeholder={t('sign_up.first_name.placeholder')} />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: t('sign_up.last_name.error'),
              },
            ]}
          >
            <Input placeholder={t('sign_up.last_name.placeholder')} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t('sign_up.email.error'),
              },
              {
                type: 'email',
                message: t('sign_up.email.validation'),
              },
            ]}
          >
            <Input placeholder={t('sign_up.email.placeholder')} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('sign_up.password.error'),
              },
            ]}
          >
            <Input.Password placeholder="*********" />
          </Form.Item>

          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              {t('sign_up.button')}
            </Button>
          </Form.Item>
        </Form>
      </Col>

    </Row>

  );
};

export default SignUp;
