import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { postSignIn } from '../../utils/api/v1/user';
import { setJWT } from '../../utils/jwt/jwt';

const getTranslationFromMessageData = (t, data) => {
  const { key, message } = data;
  const text = t(key);
  if (text === key) {
    return message;
  }
  return text;
};

const useSignUp = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = async (formData) => {
    setError(null);
    setLoading(true);

    const { status, data } = await postSignIn(formData);
    setLoading(false);
    if (status === 200) {
      setJWT(data);
      history.push('/');
    } else {
      const { errors, fallback } = data;
      let textError = errors
        ?.map((errorData) => getTranslationFromMessageData(t, errorData))
        .join(', ');
      if (!textError) {
        textError = t(fallback);
      }
      if (!fallback) {
        textError = t('sign_in.error.no_internet');
      }
      setError(textError);
    }
  };

  return [auth, error, setError, loading];
};

export default useSignUp;
