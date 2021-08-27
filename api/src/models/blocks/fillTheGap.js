export function getFillTheGapCorrectness({
  solution,
  userResponse,
  blockWeight,
}) {
  const replies = userResponse.reduce(
    (result, reply) => ({
      ...result,
      [reply.id]: reply,
    }),
    {},
  );
  return solution.every(
    (answer) =>
      replies[answer.id] && answer.value.includes(replies[answer.id].value),
  )
    ? blockWeight
    : 0;
}
