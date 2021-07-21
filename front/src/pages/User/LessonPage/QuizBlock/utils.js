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
  if (answers.length !== correctAnswers.length) {
    return {
      result: [],
      correct: false,
    };
  }
  const difference = diff(
    answers.map((x) => x.correct),
    correctAnswers,
  );
  if (difference.filter((x) => x).length === 0) {
    return {
      correct: true,
    };
  }

  const result = difference
    .map((y, i) =>
      y
        ? {
            value: answers[i].value,
            correct: correctAnswers[i],
          }
        : null,
    )
    .filter((y) => !!y);

  return {
    correct: false,
    result,
  };
};
