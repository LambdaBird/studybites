export function getClosedQuestionCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
}) {
  if (solution.includes(response)) {
    return { error: null, correctness: blockWeight };
  }
  return { error: true, correctness: null };
}
