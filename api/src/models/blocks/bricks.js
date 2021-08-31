export function getBricksCorrectness({
  solution,
  userResponse: { words },
  blockWeight,
}) {
  return solution.length === words.length &&
    solution.every((word, index) => word === words[index])
    ? blockWeight
    : 0;
}
