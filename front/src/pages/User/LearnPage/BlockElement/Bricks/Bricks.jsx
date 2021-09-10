import { useTranslation } from 'react-i18next';

import {
  BlockContentType,
  BlockIdType,
  BricksBlockAnswerType,
  BricksBlockReplyType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import AnswerResult from './Result/Result';
import BricksSelect from './BricksSelect';
import { useBricks } from './useBricks';
import { verifyAnswers } from './verifyAnswers';
import * as S from './Bricks.styled';

const Bricks = ({
  blockId,
  revision,
  answer = {},
  content,
  reply = {},
  isSolved,
}) => {
  const { t } = useTranslation('user');
  const { handleSendClick, ...selectProps } = useBricks({
    blockId,
    revision,
    content,
  });

  const { question } = content?.data;
  const { words: answerResults } = answer;
  const { words: userWords } = reply;
  const correct = verifyAnswers(userWords, answerResults);

  return (
    <>
      <ChunkWrapper>
        <S.Description>{t('editorjs:tools.bricks.title')}</S.Description>
        <S.Question>{htmlToReact(question)}</S.Question>

        <BricksSelect
          {...selectProps}
          words={isSolved ? userWords : selectProps.words}
          disabled={isSolved}
        />
      </ChunkWrapper>

      {isSolved ? (
        <ChunkWrapper>
          <AnswerResult correct={correct} results={answerResults} />
        </ChunkWrapper>
      ) : (
        <S.ButtonWrapper>
          <S.LessonButton onClick={handleSendClick}>
            {t('lesson.send')}
          </S.LessonButton>
        </S.ButtonWrapper>
      )}
    </>
  );
};

Bricks.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: BricksBlockAnswerType,
  reply: BricksBlockReplyType,
  isSolved: SolvedType,
};

export default Bricks;
