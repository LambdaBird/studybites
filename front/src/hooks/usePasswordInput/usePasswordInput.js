import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const usePasswordInput = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  const rules = [
    (value) => {
      if (value.length >= 5) {
        return null;
      }
      return t('sign_up.password.min_5_symbols');
    },
    (value) => {
      if (value.match(/\w*[a-zа-яґєёії]\w*/i)) {
        return null;
      }
      return t('sign_up.password.one_non_numerical');
    },
    (value) => {
      if (value.match(/.*[0-9].*/)) {
        return null;
      }
      return t('sign_up.password.one_numerical');
    },
  ];

  const passwordValidator = (_, value) => {
    setPassword(value);
    if (!value || value.length === 0) {
      return Promise.resolve();
    }

    const allErrors = rules.map((rule) => rule(value)).filter((x) => !!x);
    if (allErrors.length !== 0) {
      const formattedMessage = allErrors.join(', ').toLocaleLowerCase();
      return Promise.reject(
        new Error(
          formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1),
        ),
      );
    }
    return Promise.resolve();
  };

  return {
    password,
    passwordValidator,
  };
};

export default usePasswordInput;
