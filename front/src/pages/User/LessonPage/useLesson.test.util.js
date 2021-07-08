export const createParagraphBlock = (id, text) => ({
  answer: {},
  blockId: id,
  content: {
    id: `content-${id}`,
    data: { text },
    type: 'paragraph',
  },
  type: 'paragraph',
  revision: `hashTest${id}`,
});

export const createNextBlock = (id) => ({
  answer: {},
  blockId: id,
  content: {
    id: `content-${id}`,
    data: {},
    type: 'next',
  },
  type: 'next',
  revision: `hashTest${id}`,
});

export const createQuizBlock = (id, results) => ({
  blockId: id,
  content: {
    data: {
      answers: results.map((x, i) => ({ value: i })),
      question: 'Test text',
    },
    id: `content-${id}`,
    type: 'quiz',
  },
  revision: `hashTest${id}`,
  type: 'quiz',
});

export const createQuizResultBlock = (id, results, response) => ({
  answer: { results },
  blockId: id,
  content: {
    data: {
      answers: results.map((x, i) => ({ value: i })),
      question: 'Test text',
    },
    id: `content-${id}`,
    type: 'quiz',
  },
  data: {
    response,
  },
  revision: `hashTest${id}`,
  type: 'quiz',
});

export const createQuizResultBlockResponse = (id, results, response) => ({
  answer: { results },
  blockId: id,
  content: {
    data: {
      answers: results.map((x, i) => ({ value: i, correct: response[i] })),
      question: 'Test text',
    },
    id: `content-${id}`,
    type: 'quiz',
  },
  data: {
    response,
  },
  revision: `hashTest${id}`,
  type: 'quiz',
});
