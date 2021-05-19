import React from 'react';
import { Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { MainRow } from './SignIn.styled';
import SignInForm from './SignInForm';

const { Title } = Typography;

const SignIn = () => {
  const { t } = useTranslation();

  return (
    <MainRow gutter={[0, 16]} type="flex" justify="center" align="top">
      <Col span={24} align="middle">
        <Title level={1}>{t('sign_in.title')}</Title>
      </Col>
      <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 7 }} lg={{ span: 5 }}>
        <SignInForm />
      </Col>
    </MainRow>
  );
};

export default SignIn;
