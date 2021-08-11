const WRONG_ASWER_WEIGHT = -0.5;

function getQuizCorrectness({
  solution,
  userResponse,
  blockWeight,
  BadRequestError,
  error,
}) {
  if (solution.length !== userResponse.length) {
    throw new BadRequestError(error);
  }

  const numberOfRightAnswers = solution.filter(Boolean).length;

  const mark = userResponse.reduce((correctness, answer, index) => {
    return (
      correctness + +answer * (solution[index] ? 1 : 1 * WRONG_ASWER_WEIGHT)
    );
  }, 0);

  return blockWeight * Math.max(mark / numberOfRightAnswers, 0);
}

export async function getCorrectness({
  Block,
  blockId,
  revision,
  userResponse,
  blocks,
  BadRequestError,
  error,
}) {
  const { answer, type, weight } = await Block.getBlock({ blockId, revision });

  switch (type) {
    case blocks.QUIZ: {
      return getQuizCorrectness({
        solution: answer,
        userResponse,
        blockWeight: weight,
        BadRequestError,
        error,
      });
    }
    default:
      return 0;
  }
}
