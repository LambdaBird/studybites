import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DivAlignCenter,
  FormItemAlignEnd,
  SubmitButton,
  TextLink,
} from './SignInForm.styled';

const SignInForm = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const formRules = useMemo(
    () => ({
      email: [
        {
          required: true,
          message: t('sign_in.email.error'),
        },
        {
          type: 'email',
          message: t('sign_in.email.validation'),
        },
      ],
      password: [
        {
          required: true,
          message: t('sign_in.password.error'),
        },
      ],
    }),
    [t],
  );

  const onClickNoAccount = () => {
    history.push('/signUp');
  };

  return (
    <Form layout="vertical" size="large">
      <Form.Item name="email" rules={formRules.email}>
        <Input placeholder={t('sign_in.email.placeholder')} />
      </Form.Item>
      <Form.Item name="password" rules={formRules.password}>
        <Input.Password placeholder="••••••••" />
      </Form.Item>
      <FormItemAlignEnd>
        <TextLink underline strong>
          {t('sign_in.forgot_password')}
        </TextLink>
      </FormItemAlignEnd>
      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          {t('sign_in.button')}
        </SubmitButton>
      </Form.Item>
      <DivAlignCenter>
        <TextLink onClick={onClickNoAccount} underline strong>
          {t('sign_in.no_account')}
        </TextLink>
      </DivAlignCenter>
    </Form>
  );
};

export default SignInForm;
