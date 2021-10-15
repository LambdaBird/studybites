import { Alert, Form, Input } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAuthentication } from '@sb-ui/hooks/useAuthentication';
import { postSignIn } from '@sb-ui/utils/api/v1/user';
import { FORGOT_PASSWORD, SIGN_UP } from '@sb-ui/utils/paths';

import * as S from './SignInForm.styled';

const SignInForm = () => {
  const { t } = useTranslation('sign_in');
  const history = useHistory();
  const [form] = Form.useForm();
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
  const [auth, error, setError, loading] = useAuthentication({
    requestFunc: postSignIn,
    message: 'sign_in:welcome',
  });

  const [message, setMessage] = useState('');
  const [isFormErrors, setIsFormErrors] = useState(false);

  const onClickNoAccount = useCallback(() => {
    history.push(SIGN_UP);
  }, [history]);

  const onClickForgotPassword = useCallback(() => {
    history.push(FORGOT_PASSWORD);
  }, [history]);

  const handleSubmit = async (formData) => {
    await auth(formData);
  };

  const handleFieldsChange = useCallback(() => {
    setMessage(form.getFieldError('email')?.[0]);
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  return (
    <Form
      form={form}
      onFieldsChange={handleFieldsChange}
      layout="vertical"
      size="large"
      onFinish={handleSubmit}
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

      <Form.Item
        name="email"
        rules={formRules.email}
        help={<div>{message}</div>}
      >
        <Input placeholder={t('email.placeholder')} />
      </Form.Item>
      <S.FormItemAlignEnd
        name="password"
        rules={formRules.password}
        extra={
          <S.LinkButton onClick={onClickForgotPassword}>
            {t('forgot_password')}
          </S.LinkButton>
        }
      >
        <Input.Password placeholder={t('password.placeholder')} />
      </S.FormItemAlignEnd>

      <S.SubmitButton loading={loading} disabled={isFormErrors}>
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
