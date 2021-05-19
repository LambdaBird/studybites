import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signUp } from '../../utils/api/v1/user';

const getTranslationFromMessageData = (t, data) => {
  const { key, message } = data;
  let text = t(key);
  if (text === key) {
    text = message;
  }
  return text;
};

const useSignUp = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const auth = async (formData) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    const { status, data } = await signUp(formData);
    setLoading(false);
    if (status === 201) {
      const text = getTranslationFromMessageData(t, data);
      history.push('/');
      setMessage(text);
    } else {
      const { errors, fallback } = data;
      let textError = errors
        ?.map((errorData) => getTranslationFromMessageData(t, errorData))
        .join(', ');
      if (!textError) {
        textError = fallback;
      }
      if (!fallback) {
        textError = t('sign_up.error.no_internet');
      }
      setError(textError);
    }
  };

  return [auth, error, setError, loading, message];
};

export default useSignUp;
