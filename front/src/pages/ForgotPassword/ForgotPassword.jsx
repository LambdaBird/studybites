import { Form, Input, message as messageAntd } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';

import { resetPasswordNoAuth } from '@sb-ui/utils/api/v1/email';
import { EMAIL_SENT, SIGN_IN } from '@sb-ui/utils/paths';

import * as S from './ForgotPassword.styled';

const ForgotPassword = () => {
  const { t } = useTranslation('forgot_password');
  const history = useHistory();
  const [form] = Form.useForm();

  const [message, setMessage] = useState('');
  const [isFormErrors, setIsFormErrors] = useState(false);

  const handleFieldsChange = useCallback(() => {
    setMessage(form.getFieldError('email')?.[0]);
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const { mutate: mutateResetPassword, isLoading: isLoadingResetPassword } =
    useMutation(resetPasswordNoAuth, {
      onSuccess: () => {
        history.push(EMAIL_SENT);
      },
      onError: (err) => {
        if (err.response.data?.message === 'errors.email.too_frequently') {
          const timeout = err.response.data.payload?.timeout;
          messageAntd.error({
            content: t('error_reset_frequently', { timeout }),
            key: `link.fail${timeout}`,
            duration: 2,
          });
          return;
        }
        throw new Error(err);
      },
    });

  const onFinish = useCallback(
    (data) => {
      mutateResetPassword({ email: data.email });
    },
    [mutateResetPassword],
  );

  const emailRules = useMemo(
    () => [
      { required: true, message: t('email.error') },
      { type: 'email', message: t('email.validation') },
    ],
    [t],
  );

  const handleBackClick = useCallback(() => {
    history.push(SIGN_IN);
  }, [history]);

  return (
    <S.Page>
      <S.Title>{t('title')}</S.Title>
      <S.Form
        onFinish={onFinish}
        form={form}
        onFieldsChange={handleFieldsChange}
        scrollToFirstError
      >
        <Form.Item name="email" rules={emailRules} help={<div>{message}</div>}>
          <Input placeholder={t('email.placeholder')} />
        </Form.Item>
        <S.ResetButton disabled={isFormErrors} loading={isLoadingResetPassword}>
          {t('reset_button')}
        </S.ResetButton>
        <S.BackLink onClick={handleBackClick}>{t('back_sign_in')}</S.BackLink>
      </S.Form>
    </S.Page>
  );
};

export default ForgotPassword;
