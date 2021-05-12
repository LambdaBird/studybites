import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const usePasswordInput = () => {
  const { t } = useTranslation();
  const [validateStatus, setValidateStatus] = useState();
  const [help, setHelp] = useState();
  const [level, setLevel] = useState(-1);
  const [password, setPassword] = useState('');

  const rules = [
    (value) => {
      if (value.length > 5) {
        return null;
      }
      return t('sign_up.password.min_5_symbols');
    },
    (value) => {
      if (value.match(/\w*[a-zA-Z]\w*/)) {
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

  const formValidator = ((_, value) => {
    const r = rules.map((rule) => rule(value)).filter((x) => !!x);
    if (r.length !== 0) {
      return Promise.reject();
    }
    return Promise.resolve();
  });

  const onChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length === 0) {
      setHelp();
      return;
    }
    const allErrors = rules.map((rule) => rule(value)).filter((x) => !!x);
    if (allErrors.length > 0) {
      const formattedMessage = allErrors.join(', ').toLocaleLowerCase();
      setValidateStatus('error');
      setHelp(formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1));
      let errorLevel = rules.length - allErrors.length - 1;
      if (errorLevel < 0) {
        errorLevel = 0;
      }
      setLevel(errorLevel);
    } else {
      setValidateStatus('success');
      setHelp('');
      setLevel(rules.length - 1);
    }
    if (value.length === 0) {
      setLevel(-1);
    }
  };

  return {
    validateStatus, help, level, password, onChangePassword, formValidator,
  };
};

export default usePasswordInput;
