import { sleep } from '@sb-ui/utils';

export const createFinished = () => ({
  blockId: `block-finished-id`,
  content: {
    type: 'finished',
  },
  type: 'finished',
});

export const createStartBlock = (isSolved) => ({
  blockId: 'block-start-id',
  content: {
    type: 'start',
  },
  type: 'start',
  response: {
    isSolved,
  },
});

export const createParagraphBlock = (id, text) => ({
  answer: {},
  blockId: `block-${id}`,
  content: {
    id: `content-${id}`,
    data: { text },
    type: 'paragraph',
  },
  createdAt: '2021-07-14T20:37:29.848Z',
  updatedAt: '2021-07-14T20:37:29.848Z',
  revision: `hashRevision${id}`,
  type: 'paragraph',
  weight: null,
});

export const createNextBlock = (id, isSolved) => ({
  answer: {},
  blockId: `block-${id}`,
  content: {
    id: `content-${id}`,
    data: {},
    type: 'next',
  },
  createdAt: '2021-07-14T20:37:29.848Z',
  updatedAt: '2021-07-14T20:37:29.848Z',
  revision: `hashTest${id}`,
  type: 'next',
  weight: null,
  response: {
    isSolved,
  },
});

export const createQuizBlock = (id, results) => ({
  blockId: `block-${id}`,
  content: {
    data: {
      answers: results.map((x, i) => ({ value: `Value ${i + 1}` })),
      question: `Answer for question ${id}?`,
    },
    id: `content-${id}`,
    type: 'quiz',
  },
  response: {
    isResolved: false,
  },
  revision: `hashTest${id}`,
  type: 'quiz',
});

export const createFinishBlock = (isSolved) => ({
  content: {
    id: 'finish',
    type: 'finish',
  },
  type: 'finish',
  response: {
    isSolved,
  },
  blockId: `block-finish-id`,
  answer: {},
});

export const createQuizResultNoDataBlock = (id, results, response) => ({
  answer: { results },
  blockId: `block-${id}`,
  content: {
    data: {
      answers: results.map((x, i) => ({
        value: `Value ${i + 1}`,
        correct: response[i],
      })),
      question: `Answer for question ${id}?`,
    },
    id: `content-${id}`,
    type: 'quiz',
  },
  response: {
    isResolved: true,
  },
  revision: `hashTest${id}`,
  type: 'quiz',
});

export const createQuizResultBlock = (id, results, response) => ({
  ...createQuizResultNoDataBlock(id, results, response),
  data: {
    response,
  },
});

export const createMockedBlocks = (variant) => {
  switch (variant) {
    case 1:
      return {
        isFinished: false,
        blocks: [],
      };
    case 2:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, false),
        ],
      };
    case 3:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createParagraphBlock(4, 'Paragraph3'),
          createParagraphBlock(5, 'Paragraph4'),
          createQuizBlock(6, [true, true]),
        ],
      };
    case 4:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createParagraphBlock(4, 'Paragraph3'),
          createParagraphBlock(5, 'Paragraph4'),
          createQuizResultBlock(6, [true, false, true], [true, true, true]),
          createParagraphBlock(7, 'Paragraph5'),
          createParagraphBlock(8, 'Paragraph6'),
          createNextBlock(9, false),
        ],
      };
    case 5:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createParagraphBlock(4, 'Paragraph3'),
          createParagraphBlock(5, 'Paragraph4'),
          createNextBlock(6, true),
          createParagraphBlock(7, 'Paragraph5'),
          createParagraphBlock(8, 'Paragraph6'),
          createQuizResultBlock(9, [true, false, true], [true, true, true]),
          createParagraphBlock(10, 'Paragraph3'),
          createQuizBlock(11, [true, true, true, true, true]),
        ],
      };
    case 6:
      return {
        isFinished: true,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createQuizResultBlock(4, [true], [true]),
        ],
      };
    case 7:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createQuizResultBlock(4, [true], [true]),
        ],
      };
    case 8:
      return {
        isFinished: false,
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createParagraphBlock(2, 'Paragraph2'),
          createNextBlock(3, true),
          createParagraphBlock(4, 'paragraph3'),
        ],
      };
    case 9:
      return {
        isFinished: false,
        blocks: [],
      };
    case 10:
      return {
        isFinished: true,
        blocks: [],
      };
    default:
      return {
        isFinished: false,
        blocks: [],
      };
  }
};

export const createMockedBlocksResponse = ({ id, action, blockId, data }) => {
  switch (id) {
    case 1:
      if (action === 'start') {
        return {
          isFinished: false,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3, false),
          ],
        };
      }
      if (action === 'next' && blockId === 'block-3') {
        return {
          isFinished: false,
          blocks: [
            createParagraphBlock(4, 'Paragraph3'),
            createParagraphBlock(5, 'Paragraph4'),
            createNextBlock(6, false),
          ],
        };
      }
      if (action === 'next' && blockId === 'block-6') {
        return {
          isFinished: false,
          blocks: [createParagraphBlock(7, 'Paragraph5')],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 2:
      if (action === 'next' && blockId === 'block-3') {
        return {
          isFinished: false,
          blocks: [
            createParagraphBlock(4, 'Paragraph3'),
            createParagraphBlock(5, 'Paragraph4'),
            createNextBlock(6, false),
          ],
        };
      }
      if (action === 'next' && blockId === 'block-6') {
        return {
          isFinished: false,
          blocks: [
            createParagraphBlock(7, 'Paragraph5'),
            createQuizBlock(8, [true, true]),
          ],
        };
      }
      if (action === 'response' && blockId === 'block-8') {
        return {
          isFinished: false,
          response: data?.response,
          answer: [true, true],
          blocks: [
            createParagraphBlock(9, 'Paragraph6'),
            createParagraphBlock(10, 'Paragraph7'),
            createNextBlock(11, false),
          ],
        };
      }
      if (action === 'next' && blockId === 'block-11') {
        return {
          isFinished: false,
          blocks: [
            createParagraphBlock(12, 'Paragraph8'),
            createParagraphBlock(13, 'Paragraph9'),
          ],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 3:
      if (action === 'response' && blockId === 'block-6') {
        return {
          isFinished: false,
          response: data?.response,
          answer: [true, true],
          blocks: [],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 4:
      if (action === 'next' && blockId === 'block-9') {
        return {
          isFinished: false,
          blocks: [],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 5:
      if (action === 'response' && blockId === 'block-11') {
        return {
          isFinished: false,
          response: data?.response,
          answer: [false, false, true, false, false],
          blocks: [],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 7:
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 8:
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 9:
      if (action === 'start') {
        return {
          isFinished: false,
          blocks: [],
        };
      }
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    case 10:
      if (action === 'finish') {
        return {
          isFinished: true,
          blocks: [],
        };
      }
      break;
    default:
      return [];
  }
  return {
    isFinished: false,
    blocks: [],
  };
};

export const createMockedLesson = (id) => {
  const { isFinished, blocks } = createMockedBlocks(id);
  return {
    lesson: {
      authors: [{ id: 3, firstName: 'George', lastName: 'Bakman' }],
      blocks,
      id,
      description: 'Lorem description test ipsum',
      createdAt: '2021-07-14T20:37:29.848Z',
      updatedAt: '2021-07-14T20:37:29.848Z',
      status: 'Public',
      name: 'Назва уроку',
    },
    isFinished,
    total: 99,
  };
};

export const createMockedResponse = (params) => {
  const { isFinished, blocks, answer, response } =
    createMockedBlocksResponse(params);

  return {
    lesson: {
      answer: answer ? { results: answer } : {},
      data: response ? { response } : undefined,
      authors: [{ id: 3, firstName: 'George', lastName: 'Bakman' }],
      blocks,
      id: params.id,
      description: 'Lorem description test ipsum',
      createdAt: '2021-07-14T20:37:29.848Z',
      updatedAt: '2021-07-14T20:37:29.848Z',
      status: 'Public',
      name: 'Lesson name test',
    },
    isFinished,
    total: 99,
  };
};

export const getMockedLessonById = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  await sleep(500);
  return createMockedLesson(parseInt(id, 10));
};

export const postMockedLessonById = async (paramsData) => {
  await sleep(50);
  return createMockedResponse({
    ...paramsData,
    id: parseInt(paramsData.id, 10),
  });
};
