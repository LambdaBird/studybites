export const verifyAnswers = (results, answers) => {
  if (!results || !answers) {
    return {};
  }
  results?.forEach(({ left, right }) => {
    const correctAnswer = answers.find(
      (x) => x.left === left && x.right === right,
    );
    if (correctAnswer) {
      correctAnswer.correct = true;
    }
  });
  return {
    correct: answers?.every((answer) => answer.correct),
    results: answers.map((answer) => ({
      ...answer,
      correct: !!answer.correct,
    })),
  };
};
