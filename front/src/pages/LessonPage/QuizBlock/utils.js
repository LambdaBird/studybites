const diff = (a, b) => {
  const result = [];
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      result.push(true);
    } else {
      result.push(false);
    }
  }
  return result;
};

export const verifyAnswers = (answers, correctAnswers) => {
  if (answers.length === correctAnswers.length) {
    const difference = diff(answers, correctAnswers);
    if (difference.filter((x) => x).length === 0) {
      return {
        correct: true,
      };
    }
    return {
      difference,
      correct: false,
    };
  }

  return {
    correct: false,
  };
};
