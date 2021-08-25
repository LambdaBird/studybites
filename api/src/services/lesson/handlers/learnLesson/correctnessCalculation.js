const WRONG_ANSWER_WEIGHT = -0.5;

function getQuizCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
  BadRequestError,
  error,
}) {
  if (solution.length !== response.length) {
    throw new BadRequestError(error);
  }

  const numberOfRightAnswers = solution.filter(Boolean).length;

  const mark = response.reduce((correctness, answer, index) => {
    return (
      correctness + +answer * (solution[index] ? 1 : 1 * WRONG_ANSWER_WEIGHT)
    );
  }, 0);

  return blockWeight * Math.max(mark / numberOfRightAnswers, 0);
}

function getClosedQuestionCorrectness({
  solution,
  userResponse: { response },
  blockWeight,
}) {
  if (solution.includes(response)) {
    return blockWeight;
  }

  return 0;
}

function getConstructorCorrectness({
  solution,
  userResponse: { words },
  blockWeight,
}) {
  return JSON.stringify(solution) === JSON.stringify(words) ? blockWeight : 0;
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
    case blocks.CONSTRUCTOR: {
      return getConstructorCorrectness({
        solution: answer.results,
        userResponse,
        blockWeight: weight,
      });
    }
    default:
      return 0;
  }
}
