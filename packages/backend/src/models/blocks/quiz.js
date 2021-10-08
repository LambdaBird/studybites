const WRONG_ANSWER_WEIGHT = -0.5;

export function getQuizCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
}) {
  if (solution.length !== response.length) {
    return 0;
  }

  const numberOfRightAnswers = solution.filter(Boolean).length;

  const mark = response.reduce((correctness, answer, index) => {
    return (
      correctness + +answer * (solution[index] ? 1 : 1 * WRONG_ANSWER_WEIGHT)
    );
  }, 0);

  return blockWeight * Math.max(mark / numberOfRightAnswers, 0);
}
