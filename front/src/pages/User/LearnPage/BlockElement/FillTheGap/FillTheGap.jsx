import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import Result from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Result';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/verifyAnswers';
import {
  BlockContentType,
  BlockIdType,
  FillTheGapBlockAnswerType,
  FillTheGapBlockDataType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import Inputs from './Inputs';
import * as S from './FillTheGap.styled';

const FillTheGap = ({
  blockId,
  revision,
  answer = {},
  content,
  data,
  isSolved,
}) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const [response, setResponse] = useState([]);

  const handleSendClick = useCallback(() => {
    handleInteractiveClick({
      id,
      action: RESPONSE_TYPE,
      revision,
      blockId,
      data: {
        response,
      },
    });
  }, [blockId, handleInteractiveClick, id, response, revision]);

  const newData = {
    text: content.data.text,
    answers: content.data.answers,
  };
  if (data?.response !== undefined) {
    newData.answers = data.response;
  }
  const { text, answers } = newData;
  const { results } = answer;

  const { correct, result } = verifyAnswers(results, answers);

  return (
    <>
      <ChunkWrapper>
        <Inputs
          text={isSolved ? text : content.data.text}
          onData={setResponse}
          disabled={isSolved}
        />
      </ChunkWrapper>
      {isSolved ? (
        <ChunkWrapper>
          <Result correct={correct} result={result} text={text} />
        </ChunkWrapper>
      ) : (
        <S.LessonButton onClick={handleSendClick}>
          {t('lesson.send')}
        </S.LessonButton>
      )}
    </>
  );
};

FillTheGap.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: FillTheGapBlockAnswerType,
  data: FillTheGapBlockDataType,
  isSolved: SolvedType,
};

export default FillTheGap;
