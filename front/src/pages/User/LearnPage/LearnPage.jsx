/* eslint no-use-before-define: "off" */

import InfoBlock from '@sb-ui/pages/User/LessonPage/InfoBlock';

import LearnChunk from './LearnChunk';
import * as S from './LearnPage.styled';

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

    [
      createParagraphBlock(5, 'Paragraph3'),
      createQuizBlock(6, [true, true, true, true, true]),
    ],
  ];

  return (
    <>
      <S.Header />
      <div>
        <S.GlobalStylesLearnPage />
        <S.Progress percent={leanProgress} />
        <S.Row>
          <S.BlockCell>
            <S.LearnWrapper>
              <InfoBlock isLoading={isLoading} total={total} lesson={lesson} />
              {chunks.map((chunk, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <LearnChunk key={index} chunk={chunk} />
              ))}
            </S.LearnWrapper>
          </S.BlockCell>
        </S.Row>
      </div>
    </>
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

export const createFinishBlock = (id) => ({
  content: {
    id: 'finish',
    type: 'finish',
  },
  response: {
    isSolved: false,
  },
  blockId: id,
  answer: {},
});

export const createQuizResultBlock = (id, results, response) => ({
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
