import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { MainRow } from './SignUp.styled';

const { Title } = Typography;

const SignUp = () => {
  const { t } = useTranslation();

  return (
    <MainRow type="flex" justify="center" align="middle">
      <Row gutter={[0, 16]} justify="center">
        <Col span={24} align="middle">
          <Title level={1}>{t('sign_up.title')}</Title>
        </Col>
      </Row>
    </MainRow>
  );
};

export default SignUp;
