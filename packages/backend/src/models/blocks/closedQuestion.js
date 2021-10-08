export function getClosedQuestionCorrectness({
  solution,
  userResponse: { value },
  blockWeight,
}) {
  if (solution.includes(value)) {
    return blockWeight;
  }
  return 0;
}
