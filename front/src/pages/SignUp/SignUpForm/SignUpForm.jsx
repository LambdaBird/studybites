import React, { useMemo } from 'react';
import { Alert, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PasswordStrengthIndicator from '../../../components/atoms/PasswordStrengthIndicator';
import usePasswordInput from '../../../hooks/usePasswordInput';
import useAuthentication from '../../../hooks/useAuthentication';
import { postSignUp } from '../../../utils/api/v1/user';
import { DivAlignCenter, SubmitButton, LinkButton } from './SignUpForm.styled';
import { SIGN_IN } from '../../../utils/paths';

const SignUpForm = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { password, passwordValidator } = usePasswordInput();

  const [auth, error, setError, loading] = useAuthentication(postSignUp);

  const handleSubmit = async (formData) => {
    await auth(formData);
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

  const onClickHaveAccount = () => {
    history.push(SIGN_IN);
  };

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

      <Form.Item name="password" rules={formRules.password}>
        <div>
          <Input.Password placeholder={t('sign_up.password.placeholder')} />
          <PasswordStrengthIndicator value={password} />
        </div>
      </Form.Item>

      <SubmitButton type="primary" loading={loading} htmlType="submit">
        {t('sign_up.button')}
      </SubmitButton>
      <DivAlignCenter>
        <LinkButton onClick={onClickHaveAccount}>
          {t('sign_up.have_account')}
        </LinkButton>
      </DivAlignCenter>
    </Form>
  );
};

export default SignUpForm;
