import React, { useMemo } from 'react';
import { Alert, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import usePasswordInput from '../../../hooks/usePasswordInput';
import { HelpDiv, SubmitButton } from './SignUpForm.styled';

const SignUpForm = ({
  error,
  setError,
  loading,
  handleSubmit,
  handleSubmitFailed,
}) => {
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
    <Form
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
      {error && (
        <Form.Item>
          <Alert
            onClose={() => setError(null)}
            message={error}
            type="error"
            showIcon
            closable
          />
        </Form.Item>
      )}

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
        <PasswordStrengthIndicator value={password} />
      </Form.Item>

      <Form.Item>
        <SubmitButton type="primary" loading={loading} htmlType="submit">
          {t('sign_up.button')}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

SignUpForm.defaultProps = {
  error: null,
  setError: null,
  loading: null,
  handleSubmit: () => {},
  handleSubmitFailed: () => {},
};

SignUpForm.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  setError: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleSubmitFailed: PropTypes.func,
};

export default SignUpForm;
