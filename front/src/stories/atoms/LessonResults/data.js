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
