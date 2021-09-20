import { Alert, Form, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAuthentication } from '@sb-ui/hooks/useAuthentication';
import { postSignIn } from '@sb-ui/utils/api/v1/user';
import { FORGET_PASSWORD, SIGN_UP } from '@sb-ui/utils/paths';

import * as S from './SignInForm.styled';

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

  const [message, setMessage] = useState('');

  const onClickNoAccount = () => {
    history.push(SIGN_UP);
  };

  const onClickForgetPassword = () => {
    history.push(FORGET_PASSWORD);
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

      <Form.Item
        name="email"
        rules={formRules.email}
        help={<div>{message}</div>}
      >
        <Input placeholder={t('email.placeholder')} />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldError }) => {
          setMessage(getFieldError('email')[0]);
        }}
      </Form.Item>
      <S.FormItemAlignEnd
        name="password"
        rules={formRules.password}
        extra={
          <S.LinkButton onClick={onClickForgetPassword}>
            {t('forgot_password')}
          </S.LinkButton>
        }
      >
        <Input.Password placeholder={t('password.placeholder')} />
      </S.FormItemAlignEnd>

      <S.SubmitButton loading={loading} type="primary" htmlType="submit">
        {t('button')}
      </S.SubmitButton>
      <S.DivAlignCenter>
        <S.LinkButton onClick={onClickNoAccount}>
          {t('no_account')}
        </S.LinkButton>
      </S.DivAlignCenter>
    </Form>
  );
};

export default SignInForm;
