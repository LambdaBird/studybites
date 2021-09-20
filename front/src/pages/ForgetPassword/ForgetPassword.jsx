import { Button, Form, Input, message as messageAntd } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { resetPassword, resetPasswordNoAuth } from '@sb-ui/utils/api/v1/email';

import * as S from './ForgetPassword.styled';

const ForgetPassword = () => {
  const { t } = useTranslation('sign_up');
  const [form] = Form.useForm();

  const [message, setMessage] = useState('');
  const [isFormErrors, setIsFormErrors] = useState(false);

  const handleFieldsChange = useCallback(() => {
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const { mutate: mutateResetPassword, isLoading: isLoadingResetPassword } =
    useMutation(resetPasswordNoAuth, {
      onSuccess: () => {
        messageAntd.success({
          content: 'Reset link sent to your email',
          key: 'link.success',
          duration: 2,
        });
      },
      onError: (err) => {
        if (err.response.data?.message === 'errors.email.too_frequently') {
          const timeout = err.response.data.payload?.timeout;
          messageAntd.error({
            content: `You try to reset your password too frequently, try in ${timeout} seconds`,
            key: `link.fail${timeout}`,
            duration: 2,
          });
          return;
        }
        throw new Error(err);
      },
    });

  const onFinish = (data) => {
    mutateResetPassword({ email: data.email });
  };
  return (
    <S.Page>
      <Form
        onFinish={onFinish}
        style={{
          width: '400px',
        }}
        form={form}
        name=""
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        onFieldsChange={handleFieldsChange}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('email.error') },
            { type: 'email', message: t('email.validation') },
          ]}
          help={<div>{message}</div>}
        >
          <Input placeholder={t('email.placeholder')} />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldError }) => {
            setMessage(getFieldError('email')[0]);
          }}
        </Form.Item>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          <Button disabled={isFormErrors} type="primary" htmlType="submit">
            Reset email
          </Button>
        </div>
      </Form>
    </S.Page>
  );
};

export default ForgetPassword;
