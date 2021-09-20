import { Button, Form, Input, message } from 'antd';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

import { updatePassword, verifyPasswordReset } from '@sb-ui/utils/api/v1/email';
import { getJWTAccessToken, setJWT } from '@sb-ui/utils/jwt';
import { HOME } from '@sb-ui/utils/paths';

import * as S from './ChangePassword.styled';

const TIME_TO_REDIRECT_HOME_FAIL = 5000;
const TIME_TO_REDIRECT_HOME_SUCCESS = 3000;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const ChangePassword = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const { id } = useParams();

  const isLoggedIn = useMemo(() => getJWTAccessToken(), []);

  const {
    mutate: mutateUpdatePassword,
    isSuccess: isUpdatePasswordSuccess,
    isLoading: isUpdatePasswordLoading,
  } = useMutation(updatePassword, {
    onSuccess: (data) => {
      setJWT(data);
      message.success({
        content: 'Password successfully changed',
        key: 'password.success',
        duration: 2,
      });
      setTimeout(() => {
        history.push(HOME);
      }, TIME_TO_REDIRECT_HOME_SUCCESS);
    },
  });
  const { isError, isSuccess } = useQuery(
    ['verifyPasswordReset', { id }],
    verifyPasswordReset,
    {
      retry: false,
      enabled: !!id && !!isLoggedIn,
      onError: () => {
        setTimeout(() => {
          history.push(HOME);
        }, TIME_TO_REDIRECT_HOME_FAIL);
      },
    },
  );

  const onFinish = (values) => {
    mutateUpdatePassword({ id, password: values.password });
  };

  return (
    <S.Page>
      {isError && (
        <div>
          <h2>This link is expired, try reset password again</h2>
          <h4 style={{ textAlign: 'center' }}>
            In few seconds you will be redirect to home page...
          </h4>
        </div>
      )}
      {(!isLoggedIn || isSuccess) && (
        <Form
          {...formItemLayout}
          onFinish={onFinish}
          style={{
            width: '400px',
          }}
          form={form}
          name="register"
          scrollToFirstError
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password disabled={isUpdatePasswordSuccess} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The passwords do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password disabled={isUpdatePasswordSuccess} />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          >
            <Button
              disabled={isUpdatePasswordSuccess}
              loading={isUpdatePasswordLoading}
              type="primary"
              htmlType="submit"
            >
              Update password
            </Button>
          </div>
        </Form>
      )}
    </S.Page>
  );
};

export default ChangePassword;
