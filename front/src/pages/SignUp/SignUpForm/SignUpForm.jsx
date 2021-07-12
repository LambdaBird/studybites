import { Alert, Form, Input } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import PasswordStrengthIndicator from '@sb-ui/components/atoms/PasswordStrengthIndicator';
import { useAuthentication } from '@sb-ui/hooks/useAuthentication';
import { usePasswordInput } from '@sb-ui/hooks/usePasswordInput';
import { postSignUp } from '@sb-ui/utils/api/v1/user';
import { SIGN_IN } from '@sb-ui/utils/paths';

import { DivAlignCenter, LinkButton,SubmitButton } from './SignUpForm.styled';

const SignUpForm = () => {
  const { t } = useTranslation('sign_up');
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
          message: t('first_name.error'),
        },
      ],
      lastName: [
        {
          required: true,
          message: t('last_name.error'),
        },
      ],
      email: [
        {
          required: true,
          message: t('email.error'),
        },
        {
          type: 'email',
          message: t('email.validation'),
        },
      ],
      password: [
        {
          required: true,
          message: t('password.error'),
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
        <Input placeholder={t('first_name.placeholder')} />
      </Form.Item>

      <Form.Item name="lastName" rules={formRules.lastName}>
        <Input placeholder={t('last_name.placeholder')} />
      </Form.Item>

      <Form.Item name="email" rules={formRules.email}>
        <Input placeholder={t('email.placeholder')} />
      </Form.Item>

      <Form.Item name="password" rules={formRules.password}>
        <div>
          <Input.Password placeholder={t('password.placeholder')} />
          <PasswordStrengthIndicator value={password} />
        </div>
      </Form.Item>

      <SubmitButton type="primary" loading={loading} htmlType="submit">
        {t('button')}
      </SubmitButton>
      <DivAlignCenter>
        <LinkButton onClick={onClickHaveAccount}>
          {t('have_account')}
        </LinkButton>
      </DivAlignCenter>
    </Form>
  );
};

export default SignUpForm;
