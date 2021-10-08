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
  const result = answers.map((answer) => {
    if (
      results
        .find((x) => x.id === answer.id)
        .value.find(
          (res) =>
            res.trim().toLowerCase() === answer.value.trim().toLowerCase(),
        )
    ) {
      return {
        correct: true,
        ...answer,
      };
    }
    return {
      correct: false,
      ...results.find((x) => x.id === answer.id),
    };
  });

  return {
    correct: getCorrect(result),
    result,
  };
};
