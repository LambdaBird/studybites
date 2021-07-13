/* eslint no-use-before-define: "off" */
import InfoBlock from '@sb-ui/pages/User/LessonPage/InfoBlock';

import LearnChunk from './LearnChunk';
import {
  BlockCell,
  LearnPageWrapper,
  LearnWrapper,
  Progress,
  Row,
} from './styled';

const LearnPage = () => {
  const leanProgress = 50;
  const isLoading = false;
  const total = 42;
  const lesson = {
    name: 'Lesson name',
    authors: [{ firstName: 'Anton', lastName: 'Cor' }],
  };
  const chunks = [
    [
      createParagraphBlock(1, 'Paragraph1'),
      createParagraphBlock(2, 'Paragraph2'),
      createNextBlock(3, true),
    ],
    // [createQuizResultBlock(4, [true, true], [false, true])],
    [
      createParagraphBlock(5, 'Paragraph3'),
      createNextBlock(6, true),
      // createQuizBlock(7, [true, true]),
      {
        content: {
          id: 'finish',
          type: 'finish',
        },
        response: {
          isSolved: false,
        },
        blockId: 12341124,
        answer: {}
      },
    ],
  ];

  return (
    <LearnPageWrapper>
      <Progress
        showInfo={false}
        percent={leanProgress}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Row>
        <BlockCell>
          <LearnWrapper>
            <InfoBlock isLoading={isLoading} total={total} lesson={lesson} />
            {chunks.map((chunk, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <LearnChunk key={index} chunk={chunk} />
            ))}
          </LearnWrapper>
        </BlockCell>
      </Row>
    </LearnPageWrapper>
  );
};

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

export const createNextBlock = (id, isSolved) => ({
  answer: {},
  blockId: id,
  content: {
    id: `content-${id}`,
    data: {},
    type: 'next',
  },
  type: 'next',
  revision: `hashTest${id}`,
  response: {
    isSolved,
  },
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

export default LearnPage;