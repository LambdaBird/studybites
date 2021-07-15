import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { setJWT } from '@sb-ui/utils/jwt';
import { HOME } from '@sb-ui/utils/paths';

const getTranslationFromMessageData = (t, data) => {
  const { key, message } = data;
  const text = t(key);
  if (text === key) {
    return message;
  }
  return text;
};

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
      history.push(HOME);
    } else {
      const { errors, fallback } = data;
      let textError = errors
        ?.map((errorData) => getTranslationFromMessageData(t, errorData))
        .join(', ');
      if (!textError) {
        textError = t(fallback);
      }
      if (!fallback) {
        textError = t('errors.no_internet');
      }
      setError(textError);
    }
  };

  return [auth, error, setError, loading];
};
