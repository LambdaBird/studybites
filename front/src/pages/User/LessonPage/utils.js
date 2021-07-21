export const START_TYPE = 'start';
export const NEXT_TYPE = 'next';
export const QUIZ_TYPE = 'quiz';
export const FINISH_TYPE = 'finish';
export const RESPONSE_TYPE = 'response';

export const isQuizBlockResult = (block) =>
  block.type === QUIZ_TYPE &&
  block.content.data?.answers?.every((x) => x.correct !== undefined);

export const newGroupBlocks = (blocks) => {
  const filteredBlocks = [];
  let nextCount = 0;
  let lastInteractiveBlock = null;
  let lastIndex = 0;
  blocks.forEach((block, i) => {
    if (block?.type === NEXT_TYPE) {
      filteredBlocks.push(blocks.slice(lastIndex, i));
      lastIndex = i + 1;
      nextCount += 1;
    } else if (isQuizBlockResult(block)) {
      filteredBlocks.push(blocks.slice(lastIndex, i));
      filteredBlocks.push(blocks.slice(i, i + 1));
      lastIndex = i + 1;
    } else if (block?.type === QUIZ_TYPE) {
      filteredBlocks.push(blocks.slice(lastIndex, i));
      lastIndex = i + 1;
    }
  });
  if (lastIndex === 0 && blocks?.length !== 0) {
    return {
      blocks: [blocks],
      lastInteractiveBlock,
      nextCount,
    };
  }
  if (lastIndex !== blocks?.length) {
    filteredBlocks.push(blocks.slice(lastIndex));
  }
  const lastBlock = blocks[blocks.length - 1];
  if (lastBlock?.type === NEXT_TYPE || lastBlock?.type === QUIZ_TYPE) {
    lastInteractiveBlock = lastBlock;
  }

  return {
    blocks: filteredBlocks.filter((block) => block.length > 0),
    lastInteractiveBlock,
    nextCount,
  };
};

export const prepareResultToAnswers = (data) => ({
  ...data,
  lesson: {
    ...data?.lesson,
    blocks: data?.lesson?.blocks.map((x) => ({
      ...x,
      content: {
        ...x.content,
        data: {
          ...x.content.data,
          answers:
            x.type === 'quiz'
              ? x.content.data.answers.map((y, j) => ({
                  ...y,
                  correct: x.data?.response?.[j],
                }))
              : x.content.data.answers,
        },
      },
    })),
  },
});
