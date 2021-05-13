import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import SignUpForm from './SignUpForm';

const { Title } = Typography;

const SignUp = () => {
  const { t } = useTranslation();

  const handleSubmit = (values) => {
    console.log('Success:', values);
  };

  const handleSubmitFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: '100vh' }}
    >
      <Row gutter={[0, 16]} justify="center">
        <Col span={24} align="middle">
          <Title level={1}>{t('sign_up.title')}</Title>
        </Col>
        <Col>
          <SignUpForm
            handleSubmit={handleSubmit}
            handleSubmitFailed={handleSubmitFailed}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default SignUp;
