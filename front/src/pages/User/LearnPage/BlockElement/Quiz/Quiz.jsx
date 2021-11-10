import { useTranslation } from 'react-i18next';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import { useQuiz } from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/useQuiz';
import {
  BlockContentType,
  BlockIdType,
  QuizBlockAnswerType,
  QuizBlockReplyType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import QuizResult from './QuizResult';
import * as S from './Quiz.styled';

const Quiz = ({ blockId, revision, answer, content, reply, isSolved }) => {
  const { t } = useTranslation('user');
  const { question } = content?.data;

  const {
    handleSendClick,
    setQuizCheckbox,
    options,
    optionsResult,
    optionsCorrect,
    valueResult,
    valueCorrect,
    correct,
  } = useQuiz({
    blockId,
    revision,
    answer,
    content,
    reply,
  });

  return (
    <>
      <ChunkWrapper isBottom={!isSolved}>
        <S.Question>{htmlToReact(question)}</S.Question>
      </ChunkWrapper>
      {isSolved ? (
        <>
          <ChunkWrapper>
            <ColumnDisabledCheckbox
              value={valueResult}
              options={optionsResult}
            />
          </ChunkWrapper>
          <ChunkWrapper>
            <QuizResult
              value={valueCorrect}
              options={optionsCorrect}
              correct={correct}
            />
          </ChunkWrapper>
        </>
      ) : (
        <S.BlockWrapperWhite>
          <S.ColumnCheckbox onChange={setQuizCheckbox} options={options} />
          <S.ButtonWrapper>
            <S.LessonButtonSend onClick={handleSendClick}>
              {t('lesson.send')}
            </S.LessonButtonSend>
          </S.ButtonWrapper>
        </S.BlockWrapperWhite>
      )}
    </>
  );
};
Quiz.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: QuizBlockAnswerType,
  reply: QuizBlockReplyType,
  isSolved: SolvedType,
};

export default Quiz;
