import { message as MessageAntd } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { setJWT } from '@sb-ui/utils/jwt';
import { HOME } from '@sb-ui/utils/paths';

export const useAuthentication = (requestFunc) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = async (formData) => {
    setError(null);
    setLoading(true);

    const { status, data } = await requestFunc(formData);
    setLoading(false);
    if (status.toString().startsWith('2')) {
      setJWT(data);
      MessageAntd.success({
        content: t('sign_up:email_verification'),
        duration: 2,
      });
      history.push(HOME);
    } else {
      const { message } = data;
      let textError = t(message);
      if (!textError) {
        textError = t('errors.no_internet');
      }
      setError(textError);
    }
  };

  return [auth, error, setError, loading];
};
