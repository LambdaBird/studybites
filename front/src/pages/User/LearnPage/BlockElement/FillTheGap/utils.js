export const CORRECT_ALL = 'all';
export const CORRECT_PARTIAL = 'partial';
export const CORRECT_NONE = 'none';
export const verifyAnswers = (results, answers) => {
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

  let correct = CORRECT_PARTIAL;
  if (result.every((x) => x.correct)) {
    correct = CORRECT_ALL;
  } else if (result.every((x) => !x.correct)) {
    correct = CORRECT_NONE;
  }

  return {
    correct,
    result,
  };
};
