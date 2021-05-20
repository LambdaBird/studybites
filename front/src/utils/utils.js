const escapeRegExp = (string) => string.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');

export const getPasswordStrength = (password = '') => {
  if (password.length === 0) {
    return -1;
  }
  const options = [
    {
      id: 0,
      value: 'Too weak',
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: 'Weak',
      minDiversity: 2,
      minLength: 6,
    },
    {
      id: 2,
      value: 'Medium',
      minDiversity: 4,
      minLength: 8,
    },
    {
      id: 3,
      value: 'Strong',
      minDiversity: 4,
      minLength: 10,
    },
  ];
  const rules = [
    new RegExp(/[a-z]/),
    new RegExp(/[A-Z]/),
    new RegExp(/[0-9]/),
    new RegExp(`[${escapeRegExp('!@#$%^&*')}]`),
  ];
  const passedRules = rules.filter((rule) => rule.test(password));
  const fulfilledOptions = options
    .filter((option) => passedRules.length >= option.minDiversity)
    .filter((option) => password.length >= option.minLength)
    .sort((o1, o2) => o2.id - o1.id);
  return fulfilledOptions[0].id;
};
