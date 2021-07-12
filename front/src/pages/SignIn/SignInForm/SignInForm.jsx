import { Alert, Form, Input } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAuthentication } from '@sb-ui/hooks/useAuthentication';
import { postSignIn } from '@sb-ui/utils/api/v1/user';
import { SIGN_UP } from '@sb-ui/utils/paths';

import {
  DivAlignCenter,
  FormItemAlignEnd,
  LinkButton,
  SubmitButton,
} from './SignInForm.styled';

const SignInForm = () => {
  const { t } = useTranslation('sign_in');
  const history = useHistory();
  const formRules = useMemo(
    () => ({
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
      ],
    }),
    [t],
  );
  const [auth, error, setError, loading] = useAuthentication(postSignIn);

  const onClickNoAccount = () => {
    history.push(SIGN_UP);
  };

  const handleSubmit = async (formData) => {
    await auth(formData);
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

      <Form.Item name="email" rules={formRules.email}>
        <Input placeholder={t('email.placeholder')} />
      </Form.Item>
      <FormItemAlignEnd
        name="password"
        rules={formRules.password}
        extra={<LinkButton>{t('forgot_password')}</LinkButton>}
      >
        <Input.Password placeholder={t('password.placeholder')} />
      </FormItemAlignEnd>

      <SubmitButton loading={loading} type="primary" htmlType="submit">
        {t('button')}
      </SubmitButton>
      <DivAlignCenter>
        <LinkButton onClick={onClickNoAccount}>{t('no_account')}</LinkButton>
      </DivAlignCenter>
    </Form>
  );
};

export default SignInForm;
