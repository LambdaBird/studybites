import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SignUpFormStyled, SubmitButton } from './SignUpForm.styled';

const SignUpForm = ({ handleSubmit, handleSubmitFailed }) => {
  const { t } = useTranslation();
  const formRules = useMemo(
    () => ({
      firstName: [
        {
          required: true,
          message: t('sign_up.first_name.error'),
        },
      ],
      lastName: [
        {
          required: true,
          message: t('sign_up.last_name.error'),
        },
      ],
      email: [
        {
          required: true,
          message: t('sign_up.email.error'),
        },
        {
          type: 'email',
          message: t('sign_up.email.validation'),
        },
      ],
      password: [
        {
          required: true,
          message: t('sign_up.password.error'),
        },
      ],
    }),
    [t],
  );

  return (
    <SignUpFormStyled
      layout="vertical"
      size="large"
      onFinish={handleSubmit}
      onFinishFailed={handleSubmitFailed}
    >
      <Form.Item name="firstName" rules={formRules.firstName}>
        <Input placeholder={t('sign_up.first_name.placeholder')} />
      </Form.Item>

      <Form.Item name="lastName" rules={formRules.lastName}>
        <Input placeholder={t('sign_up.last_name.placeholder')} />
      </Form.Item>

      <Form.Item name="email" rules={formRules.email}>
        <Input placeholder={t('sign_up.email.placeholder')} />
      </Form.Item>

      <Form.Item name="password" rules={formRules.password}>
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          {t('sign_up.button')}
        </SubmitButton>
      </Form.Item>
    </SignUpFormStyled>
  );
};

SignUpForm.defaultProps = {
  handleSubmit: () => {},
  handleSubmitFailed: () => {},
};

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleSubmitFailed: PropTypes.func,
};

export default SignUpForm;
