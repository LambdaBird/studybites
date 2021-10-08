import { Form, Input, Spin } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useChangePassword } from '@sb-ui/pages/ChangePassword/useChangePassword';

import * as S from './ChangePassword.styled';

const formItemLayout = {};

const ChangePassword = () => {
  const [form] = Form.useForm();

  const { t } = useTranslation('change_password');
  const { id } = useParams();

  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [isFormErrors, setIsFormErrors] = useState(false);

  const {
    isError,
    isSuccess,
    isLoading,
    isUpdatePasswordSuccess,
    isUpdatePasswordLoading,
    handleFormFinish,
  } = useChangePassword({ id });

  const handleFieldsChange = useCallback(() => {
    setPasswordMessage(form.getFieldError('password')?.[0]);
    setConfirmPasswordMessage(form.getFieldError('confirm')?.[0]);
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const passwordRules = useMemo(
    () => [
      {
        required: true,
        message: t('password.error'),
      },
    ],
    [t],
  );

  const confirmPassword = useMemo(
    () => [
      {
        required: true,
        message: t('password.error'),
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error(t('confirm_password.error_not_match')),
          );
        },
      }),
    ],
    [t],
  );

  return (
    <S.Page>
      {(isError || isUpdatePasswordSuccess) && (
        <S.TextWrapper>
          <S.TitlePasswordChange>
            {t(isUpdatePasswordSuccess ? 'password_changed' : 'link_expired')}
          </S.TitlePasswordChange>
          <S.TextRedirect>{t('redirect_text')}</S.TextRedirect>
        </S.TextWrapper>
      )}
      {isSuccess && !isError && !isUpdatePasswordSuccess && (
        <>
          <S.Title>{t('title')}</S.Title>
          <S.Form
            {...formItemLayout}
            onFinish={handleFormFinish}
            form={form}
            onFieldsChange={handleFieldsChange}
          >
            <Form.Item
              name="password"
              rules={passwordRules}
              hasFeedback
              help={<div>{passwordMessage}</div>}
            >
              <Input.Password
                placeholder={t('password.placeholder')}
                disabled={isUpdatePasswordSuccess}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={confirmPassword}
              help={<div>{confirmPasswordMessage}</div>}
            >
              <Input.Password
                placeholder={t('confirm_password.placeholder')}
                disabled={isUpdatePasswordSuccess}
              />
            </Form.Item>
            <S.ButtonWrapper>
              <S.UpdateButton
                disabled={isFormErrors || isUpdatePasswordSuccess}
                loading={isUpdatePasswordLoading}
              >
                {t('update_button')}
              </S.UpdateButton>
            </S.ButtonWrapper>
          </S.Form>
        </>
      )}
      {isLoading && <Spin tip={t('loading')} />}
    </S.Page>
  );
};

export default ChangePassword;
