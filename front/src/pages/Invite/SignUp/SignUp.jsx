import { Alert, Form, Input } from 'antd';
import T from 'prop-types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PasswordStrengthIndicator from '@sb-ui/components/atoms/PasswordStrengthIndicator';
import { useAuthentication } from '@sb-ui/hooks/useAuthentication';
import { useForm } from '@sb-ui/pages/Invite/useForm';
import { postSignUp } from '@sb-ui/utils/api/v1/user';

import * as S from '../Invite.styled';

const SignUp = ({ email, isRegistered }) => {
  const { t } = useTranslation('sign_up');
  const [form] = Form.useForm();

  const [isFormErrors, setIsFormErrors] = useState(false);

  const handleFieldsChange = useCallback(() => {
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const { formRules, password } = useForm({ isRegistered });

  const handleSubmit = async () => {
    // TODO: make here implementation after connecting with API;
  };

  // TODO: remove it after connecting with API;
  // eslint-disable-next-line no-unused-vars
  const [auth, error, setError] = useAuthentication({
    requestFunc: postSignUp,
    message: 'sign_up:email_verification',
  });

  const loading = false;

  const buttonKey = isRegistered
    ? 'invite:buttons.sign_in'
    : 'invite:buttons.sign_up';

  return (
    <S.Form
      form={form}
      onFieldsChange={handleFieldsChange}
      onFinish={handleSubmit}
    >
      {error && (
        <Form.Item>
          <Alert
            onClose={() => setError(null)}
            message={t(error)}
            type="error"
            showIcon
            closable
          />
        </Form.Item>
      )}

      <S.EmailInput
        value={email}
        disabled
        placeholder={t('email.placeholder')}
      />

      {!isRegistered && (
        <>
          <Form.Item name="firstName" rules={formRules.firstName}>
            <Input placeholder={t('first_name.placeholder')} />
          </Form.Item>

          <Form.Item name="lastName" rules={formRules.lastName}>
            <Input placeholder={t('last_name.placeholder')} />
          </Form.Item>
        </>
      )}

      <Form.Item name="password" rules={formRules.password}>
        <div>
          <Input.Password placeholder={t('password.placeholder')} />
          {!isRegistered && <PasswordStrengthIndicator value={password} />}
        </div>
      </Form.Item>

      <S.Button loading={loading} disabled={isFormErrors}>
        {t(buttonKey)}
      </S.Button>
    </S.Form>
  );
};

SignUp.propTypes = {
  email: T.string,
  isRegistered: T.bool,
};

export default SignUp;
