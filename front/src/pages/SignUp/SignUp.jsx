import React from 'react';
import { Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { MainForm, MainRow } from './SignUp.styled';
import SignUpForm from './SignUpForm';

const { Title } = Typography;

const SignUp = () => {
  const { t } = useTranslation();

  return (
    <MainRow type="flex" justify="center" align="top">
      <MainForm gutter={[0, 16]} justify="center">
        <Col span={24} align="middle">
          <Title level={1}>{t('sign_up.title')}</Title>
        </Col>
        <Col span={12}>
          <SignUpForm />
        </Col>
      </MainForm>
    </MainRow>
  );
};

export default SignUp;
