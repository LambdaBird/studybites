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

function getClosedQuestionCorrectness({ solution, userResponse, blockWeight }) {
  if (solution.includes(userResponse)) {
    return blockWeight;
  }

  return 0;
}

function getMatchCorrectness({ solution, userResponse, blockWeight }) {
  const correctAnswer = userResponse
    ?.map(({ from, to }) => {
      return solution.find((x) => x.from === from && x.to === to);
    })
    ?.filter((x) => !!x);

  return blockWeight * Math.max(correctAnswer / solution.length, 0);
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
        solution: answer.results,
        userResponse,
        blockWeight: weight,
        BadRequestError,
        error,
      });
    }
    case blocks.CLOSED_QUESTION: {
      return getClosedQuestionCorrectness({
        solution: answer.results,
        userResponse,
        blockWeight: weight,
      });
    }
    case blocks.MATCH: {
      return getMatchCorrectness({
        solution: answer.results,
        userResponse,
        blockWeight: weight,
      });
    }
    default:
      return 0;
  }
}
