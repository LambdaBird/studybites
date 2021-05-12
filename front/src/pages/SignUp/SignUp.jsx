import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import SignUpForm from '../../components/Form';

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
    <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col type="flex" align="middle">
        <Title level={2}>
          {t('general.welcome')}
        </Title>
        <SignUpForm handleSubmit={handleSubmit} handleSubmitFailed={handleSubmitFailed} />
      </Col>

    </Row>

  );
};

export default SignUp;
