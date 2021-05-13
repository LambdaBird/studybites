import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import usePasswordInput from '../../../hooks/usePasswordInput';
import { HelpDiv, SignUpFormStyled, SubmitButton } from './SignUpForm.styled';

const SignUpForm = ({ handleSubmit, handleSubmitFailed }) => {
  const { t } = useTranslation();
  const {
    validateStatus,
    help,
    password,
    onChangePassword,
    passwordValidator,
  } = usePasswordInput();
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
        {
          validator: passwordValidator,
        },
      ],
    }),
    [t, passwordValidator],
  );

  return (
    <SignUpFormStyled
      layout="vertical"
      fields={[
        {
          name: ['password'],
          value: password,
        },
      ]}
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

      <Form.Item
        name="password"
        rules={formRules.password}
        validateStatus={validateStatus}
        help={<HelpDiv className="alert">{help}</HelpDiv>}
      >
        <Input.Password
          value={password}
          onChange={onChangePassword}
          placeholder="••••••••"
        />
        <PasswordStrengthIndicator
          value={password}
          settings={{
            colorScheme: {
              levels: ['#ff4033', '#fe940d', '#ffd908', '#6ecc3a'],
              noLevel: 'lightgrey',
            },
            height: 4,
            alwaysVisible: false,
          }}
        />
      </Form.Item>

      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          {t('sign_up.button')}
        </SubmitButton>
      </Form.Item>
    </SignUpFormStyled>
  );
};

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleSubmitFailed: PropTypes.func.isRequired,
};

export default SignUpForm;
