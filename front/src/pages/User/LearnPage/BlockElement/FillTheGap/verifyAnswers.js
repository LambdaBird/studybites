import { CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL } from './constants';

const getCorrect = (result) => {
  if (result.every((x) => x.correct)) {
    return CORRECT_ALL;
  }
  if (result.every((x) => !x.correct)) {
    return CORRECT_NONE;
  }
  return CORRECT_PARTIAL;
};

export const verifyAnswers = (results, answers) => {
  if (!results || !answers) {
    return {};
  }
  const result = answers.map((answer, index) => {
    if (
      results[index].find(
        (res) => res.trim().toLowerCase() === answer.trim().toLowerCase(),
      )
    ) {
      return {
        correct: true,
        value: answer,
      };
    }
    return {
      correct: false,
      value: results[index]?.[0],
    };
  });

  return {
    correct: getCorrect(result),
    result,
  };
};
