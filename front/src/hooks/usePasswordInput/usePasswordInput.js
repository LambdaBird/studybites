// MIN 5 SYMBOLS
// AT LEAST ONE NON NUMERICAL
// AT LEAST ONE NUMERICAL

import { useState } from 'react';

const usePasswordInput = () => {
  const [help, setHelp] = useState('');
  const [level, setLevel] = useState(-1);
  const [validateStatus, setValidateStatus] = useState('');
  const [password, setPassword] = useState('');
  const rules = [
    (value) => {
      if (value.length > 5) {
        return null;
      }
      return 'Min 5 symbols';
    },
    (value) => {
      if (value.match(/\w*[a-zA-Z]\w*/)) {
        return null;
      }
      return 'At least one non numerical';
    },
    (value) => {
      if (value.match(/.*[0-9].*/)) {
        return null;
      }
      return 'At least one numerical';
    },
  ];

  const onChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
    if (value.length === 0) {
      console.log(value.length);
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

  return [validateStatus, help, level, password, onChangePassword];
};

export default usePasswordInput;
