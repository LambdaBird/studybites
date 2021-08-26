const WRONG_ANSWER_WEIGHT = -0.5;

export function getQuizCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
}) {
  if (solution.length !== response.length) {
    return { error: true, correctness: null };
  }

  const numberOfRightAnswers = solution.filter(Boolean).length;

  const mark = response.reduce((correctness, answer, index) => {
    return (
      correctness + +answer * (solution[index] ? 1 : 1 * WRONG_ANSWER_WEIGHT)
    );
  }, 0);

  return {
    error: null,
    correctness: blockWeight * Math.max(mark / numberOfRightAnswers, 0),
  };
}
