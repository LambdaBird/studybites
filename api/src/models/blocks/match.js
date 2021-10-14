export function getMatchCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
}) {
  const correctAnswer = response
    ?.map(({ left, right }) => {
      return solution.find((x) => x.left === left && x.right === right);
    })
    ?.filter((x) => !!x);

  return blockWeight * Math.max(correctAnswer.length / solution.length, 0);
}
