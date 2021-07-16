/* eslint no-use-before-define: "off" */

import LearnContext from '@sb-ui/contexts/LearnContext';
import BlockElement from '@sb-ui/pages/User/LessonPage/BlockElement';
import InfoBlock from '@sb-ui/pages/User/LessonPage/InfoBlock';

import LearnChunk from './LearnChunk';
import * as S from './LearnPage.styled';

const LearnPage = () => {
  const lessonId = 2;
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
      createParagraphBlock(1, 'Paragraph1'),
      createParagraphBlock(2, 'Paragraph2'),
      createNextBlock(3, true),
    ],
    [
      createParagraphBlock(4, 'Paragraph1'),
      createParagraphBlock(5, 'Paragraph2'),
      createQuizResultBlock(6, [true, false, true], [true, true, true]),
    ],
    [
      createParagraphBlock(7, 'Paragraph3'),
      createQuizBlock(8, [true, true, true, true, true]),
    ],
  ];

  const mutate = (params) => {
    console.log(params);
  };

  return (
    <>
      <S.Header />
      <S.Wrapper>
        <S.GlobalStylesLearnPage />
        <S.Progress percent={leanProgress} />
        <S.Row>
          <S.BlockCell>
            <LearnContext.Provider
              value={{
                mutate,
                id: lessonId,
              }}
            >
              <S.LearnWrapper>
                <InfoBlock
                  isLoading={isLoading}
                  total={total}
                  lesson={lesson}
                />
                {chunks.map((chunk, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <LearnChunk key={index} chunk={chunk} />
                ))}
                {chunks?.length === 0 && (
                  <BlockElement element={createStartBlock()} />
                )}
              </S.LearnWrapper>
            </LearnContext.Provider>
          </S.BlockCell>
        </S.Row>
      </S.Wrapper>
    </>
  );
};

export const createStartBlock = () => ({
  content: {
    type: 'start',
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
  type: 'paragraph',
  revision: `hashTest${id}`,
});

export const createNextBlock = (id, isSolved) => ({
  answer: {},
  blockId: `block-${id}`,
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
  blockId: `block-${id}`,
  content: {
    data: {
      answers: results.map((x, i) => ({ value: `Value ${i + 1}` })),
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
  blockId: `block-${id}`,
  answer: {},
});

export const createQuizResultBlock = (id, results, response) => ({
  answer: { results },
  blockId: `block-${id}`,
  content: {
    data: {
      answers: results.map((x, i) => ({
        value: `Value ${i + 1}`,
        correct: response[i],
      })),
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
