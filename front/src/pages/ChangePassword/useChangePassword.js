import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { updatePassword, verifyPasswordReset } from '@sb-ui/utils/api/v1/email';
import { getJWTAccessToken, setJWT } from '@sb-ui/utils/jwt';
import { HOME } from '@sb-ui/utils/paths';

const TIME_TO_REDIRECT_HOME_FAIL = 5000;
const TIME_TO_REDIRECT_HOME_SUCCESS = 3000;

export const useChangePassword = ({ id }) => {
  const isLoggedIn = useMemo(() => getJWTAccessToken(), []);
  const { t } = useTranslation('change_password');
  const history = useHistory();

  const {
    mutate: mutateUpdatePassword,
    isSuccess: isUpdatePasswordSuccess,
    isLoading: isUpdatePasswordLoading,
  } = useMutation(updatePassword, {
    onSuccess: (data) => {
      setJWT(data);
      message.success({
        content: t('password_changed'),
        key: 'password.success',
        duration: 2,
      });
      setTimeout(() => {
        history.push(HOME);
      }, TIME_TO_REDIRECT_HOME_SUCCESS);
    },
  });
  const { isError, isSuccess, isLoading } = useQuery(
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

  const handleFormFinish = useCallback(
    (values) => {
      mutateUpdatePassword({ id, password: values.password });
    },
    [id, mutateUpdatePassword],
  );

  return {
    isLoggedIn,
    isError,
    isSuccess,
    isLoading,
    isUpdatePasswordSuccess,
    isUpdatePasswordLoading,
    mutateUpdatePassword,
    handleFormFinish,
  };
};
