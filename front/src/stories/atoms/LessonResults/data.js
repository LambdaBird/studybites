export const exampleData = {
  startTime: '2021-09-21T11:12:07.697Z',
  results: [
    { action: 'start' },
    {
      action: 'response',
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
      data: { value: '123' },
      correctness: 0,
      time: 2000,
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
      data: { isSolved: true },
      time: 4200,
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
      data: { isSolved: true },
      time: 3549,
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
      data: { response: [true] },
      correctness: 1,
      time: 2500,
    },
    { action: 'finish', time: 1400 },
  ],
};

export const allBlocksData = {
  startTime: '2021-09-21T11:12:07.697Z',
  results: [
    {
      action: 'start',
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
      time: 500,
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
      time: 2500,
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
      time: 3450,
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
      time: 600,
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
      time: 3400,
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
      time: 1200,
    },
    {
      action: 'finish',
      time: 100,
    },
  ],
};

export const noBlocksData = {
  startTime: '2021-09-21T11:12:07.697Z',
  results: [],
};

export const onlyStartData = {
  startTime: '2021-09-21T11:12:07.697Z',
  results: [
    {
      action: 'start',
    },
  ],
};

export const startWithFinishData = {
  startTime: '2021-09-21T11:12:07.697Z',
  results: [
    {
      action: 'start',
    },
    {
      action: 'finish',
      time: 1234,
    },
  ],
};
