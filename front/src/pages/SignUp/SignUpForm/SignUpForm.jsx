import React, { useMemo } from 'react';
import { Alert, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import usePasswordInput from '../../../hooks/usePasswordInput';
import { FormItemPassword, SubmitButton } from './SignUpForm.styled';
import useSignUp from '../../../hooks/useSignUp';

const SignUpForm = () => {
  const { t } = useTranslation();
  const { password, passwordValidator } = usePasswordInput();

  const [auth, error, setError, loading] = useSignUp();

  const handleSubmit = (formData) => {
    auth(formData);
  };

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
    <Form layout="vertical" size="large" onFinish={handleSubmit}>
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

      <FormItemPassword
        name="password"
        rules={formRules.password}
        style={{ marginBottom: 0, height: '100px' }}
      >
        <div>
          <Input.Password placeholder="••••••••" />
          <PasswordStrengthIndicator value={password} />
        </div>
      </FormItemPassword>

      <Form.Item>
        <SubmitButton type="primary" loading={loading} htmlType="submit">
          {t('sign_up.button')}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
