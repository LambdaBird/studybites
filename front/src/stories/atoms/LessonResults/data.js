export const exampleData = {
  results: [
    { action: 'start', createdAt: '2021-09-21T11:12:07.697Z' },
    {
      action: 'response',
      lessonId: 1,
      block: {
        id: '1',
        revision: '1',
        content: {
          id: 'test1',
          type: 'closedQuestion',
          data: {
            question: 'asd',
          },
        },
        type: 'closedQuestion',
        answer: {
          explanation: 'f',
          results: ['Пример'],
        },
      },
      createdAt: '2021-09-21T11:13:07.697Z',
      data: { value: '123' },
      correctness: 0,
    },
    {
      action: 'next',
      block: {
        id: '2',
        revision: '2',
        content: {
          id: 'test2',
          type: 'next',
          data: {},
        },
        type: 'next',
      },
      createdAt: '2021-09-21T11:13:36.697Z',
      data: { isSolved: true },
    },
    {
      action: 'response',
      block: {
        id: '3',
        revision: '3',
        content: {
          id: 'test2',
          type: 'next',
          data: {},
        },
        type: 'next',
      },
      createdAt: '2021-09-21T11:15:07.697Z',
      data: { isSolved: true },
    },
    {
      action: 'response',
      block: {
        id: '4',
        revision: '4',
        content: {
          id: 'test2',
          type: 'quiz',
          data: { question: 'a', answers: [{ value: '2' }] },
        },
        type: 'quiz',
        answer: {
          results: [true],
        },
      },
      createdAt: '2021-09-21T11:16:07.697Z',
      data: { response: [true] },
      correctness: 1,
    },
    { action: 'finish', createdAt: '2021-09-21T11:19:01.697Z' },
  ],
};

export const allBlocksData = {
  results: [
    {
      action: 'start',
      createdAt: '2021-09-21T11:12:07.697Z',
    },
    {
      action: 'next',
      block: {
        id: '2',
        revision: '2',
        content: { id: 'ERJ97m7yRe', type: 'next', data: {} },
        type: 'next',
      },
      data: { isSolved: true },
      correctness: null,
      createdAt: '2021-09-21T11:12:22.697Z',
    },
    {
      action: 'response',
      block: {
        id: '3',
        revision: '3',
        content: {
          id: 'rVBpEOkzei',
          type: 'bricks',
          data: { question: 'How', words: ['d', '2', 'b', 'c', '1', '3', 'a'] },
        },
        answer: {
          words: ['a', 'b', 'c', 'd'],
        },
        type: 'bricks',
      },
      data: { words: ['a', 'b', 'c', 'd', '1'] },
      correctness: 0,
      createdAt: '2021-09-21T11:12:36.697Z',
    },
    {
      action: 'response',
      block: {
        id: '4',
        revision: '4',
        content: {
          id: '_-dEq05b0c',
          type: 'fillTheGap',
          data: {
            tokens: [
              {
                value: 'Here is an example of a sentence with ',
                id: 1,
                type: 'text',
              },
              { value: '', id: 2, type: 'input' },
              { value: ' spaces that a ', id: 3, type: 'text' },
              { value: '', id: 4, type: 'input' },
              { value: ' will need to fill in.', id: 5, type: 'text' },
            ],
          },
        },
        answer: {
          results: [
            { value: ['empty', 'vacant', 'blank'], id: 2, type: 'input' },
            { value: ['learner', 'student'], id: 4, type: 'input' },
          ],
        },
        type: 'fillTheGap',
      },
      data: {
        response: [
          { value: 'exa', id: 2, type: 'input' },
          { value: '2', id: 4, type: 'input' },
        ],
      },
      correctness: 0,
      createdAt: '2021-09-21T11:13:01.697Z',
    },
    {
      action: 'response',
      block: {
        id: '5',
        revision: '5',
        content: {
          id: '3RA9joDKdq',
          type: 'match',
          data: {
            values: [
              { left: '1', right: '2' },
              { left: '3', right: '4' },
            ],
          },
        },
        answer: {
          results: [
            { left: '1', right: '2' },
            { left: '3', right: '4' },
          ],
        },
        type: 'match',
      },
      data: {
        response: [
          { left: '1', right: '2' },
          { left: '3', right: '4' },
        ],
      },
      correctness: 1,
      createdAt: '2021-09-21T11:13:06.697Z',
    },
    {
      action: 'response',
      block: {
        id: '6',
        revision: '6',
        content: {
          id: 'o60tFwJTk2',
          type: 'closedQuestion',
          data: { question: 'How' },
        },
        answer: { explanation: '', results: ['yes'] },
        type: 'closedQuestion',
      },
      data: { value: '767' },
      correctness: 0,
      createdAt: '2021-09-21T11:13:09.697Z',
    },
    {
      action: 'response',
      block: {
        id: '7',
        revision: '7',
        content: {
          id: 'DmlumKhYWM',
          type: 'quiz',
          data: { question: '2+2?', answers: [{ value: '4' }, { value: 'a' }] },
        },
        answer: { results: [true, false] },
        type: 'quiz',
      },
      data: { response: [true, false] },
      correctness: 1,
      createdAt: '2021-09-21T11:14:22.797Z',
    },
    {
      action: 'finish',
      createdAt: '2021-09-21T11:14:23.997Z',
    },
  ],
};

export const noBlocksData = {
  results: [],
};

export const onlyStartData = {
  results: [
    {
      action: 'start',
      createdAt: '2021-09-21T11:12:07.697Z',
    },
  ],
};

export const startWithFinishData = {
  results: [
    {
      action: 'start',
      createdAt: '2021-09-21T11:12:07.697Z',
    },
    {
      action: 'finish',
      createdAt: '2021-09-21T11:12:09.102Z',
    },
  ],
};
