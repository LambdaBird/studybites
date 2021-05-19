import React from 'react';
import { Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { MainRow } from './SignUp.styled';
import SignUpForm from './SignUpForm';
import useSignUp from '../../hooks/useSignUp';

const { Title } = Typography;

const SignUp = () => {
  const { t } = useTranslation();

  const [auth, error, setError, loading] = useSignUp();

  const handleSubmit = (formData) => {
    auth(formData);
  };

  return (
    <MainRow gutter={[0, 16]} type="flex" justify="center" align="top">
      <Col span={24} align="middle">
        <Title level={1}>{t('sign_up.title')}</Title>
      </Col>
      <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 7 }} lg={{ span: 5 }}>
        <SignUpForm
          error={error}
          setError={setError}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </Col>
    </MainRow>
  );
};

export default SignUp;
