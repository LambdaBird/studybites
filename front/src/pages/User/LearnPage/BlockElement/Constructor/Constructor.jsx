import { useTranslation } from 'react-i18next';

import AnswerResult from '@sb-ui/pages/User/LearnPage/BlockElement/Constructor/Result';
import { useConstructor } from '@sb-ui/pages/User/LearnPage/BlockElement/Constructor/useConstructor';
import {
  BlockContentType,
  BlockIdType,
  ConstructorBlockAnswerType,
  ConstructorBlockReplyType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import Select from './Select';
import { verifyAnswers } from './verifyAnswers';
import * as S from './Constructor.styled';

const Constructor = ({
  blockId,
  revision,
  answer = {},
  content,
  reply = {},
  isSolved,
}) => {
  const { t } = useTranslation('user');
  const { handleSendClick, ...selectProps } = useConstructor({
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
        <S.Description>{t('editorjs:tools.constructor.title')}</S.Description>
        <S.Question>{question}</S.Question>
        {isSolved ? (
          <Select
            words={userWords}
            question={selectProps.question}
            additionalLines={selectProps.additionalLines}
            setAdditionalLines={selectProps.setAdditionalLines}
            disabled
          />
        ) : (
          <Select {...selectProps} />
        )}
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

Constructor.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: ConstructorBlockAnswerType,
  reply: ConstructorBlockReplyType,
  isSolved: SolvedType,
};

export default Constructor;
