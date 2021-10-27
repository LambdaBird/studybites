import { DEFAULT_CODE } from '@sb-ui/i18n';

const escapeRegExp = (string) => string.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');

export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, [ms]);
  });

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export const getQueryPage = (params) => {
  let incorrect = false;
  let pageNumber = parseInt(new URLSearchParams(params).get('page'), 10);
  if (!pageNumber) {
    pageNumber = 1;
    incorrect = true;
  }
  if (pageNumber < 0) {
    pageNumber = 1;
    incorrect = true;
  }
  return {
    page: pageNumber,
    incorrect,
  };
};

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

export const getProgressEnrolledLesson = (blocks, totalBlocks) =>
  (blocks?.length / totalBlocks).toFixed(2) * 100 || 0;

export const skeletonArray = (size) =>
  [...new Array(size)].map((_, index) => ({
    id: `skeleton ${index}`,
  }));

export const formatDate = (date, localeCode = DEFAULT_CODE) =>
  date &&
  new Intl.DateTimeFormat(localeCode, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

export const shuffleArray = (array) => {
  const shuffledArray = array.slice();
  for (let i = 0; i < shuffledArray.length; i += 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
