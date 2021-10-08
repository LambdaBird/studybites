export function getFillTheGapCorrectness({
  solution: { results },
  userResponse: { response },
  blockWeight,
}) {
  const replies = response.reduce(
    (result, reply) => ({
      ...result,
      [reply.id]: reply,
    }),
    {},
  );
  return results.every(
    (answer) =>
      replies[answer.id] && answer.value.includes(replies[answer.id].value),
  )
    ? blockWeight
    : 0;
}
