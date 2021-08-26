import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import Result from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Result';
import { verifyAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/verifyAnswers';
import {
  BlockContentType,
  BlockIdType,
  FillTheGapBlockAnswerType,
  FillTheGapBlockReplyType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import GapsInput from './GapsInput';
import * as S from './FillTheGap.styled';

const FillTheGap = ({
  blockId,
  revision,
  answer = {},
  content,
  reply = {},
  isSolved,
}) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);

  const { tokens } = content.data;

  const [gapsInput, setGapsInput] = useState(
    tokens?.map((token) => {
      const input = reply.response?.find((x) => x.id === token.id);
      return {
        ...token,
        value: input ? input.value : token.value,
      };
    }),
  );

  const handleSendClick = useCallback(() => {
    handleInteractiveClick({
      id,
      action: RESPONSE_TYPE,
      revision,
      blockId,
      reply: {
        response: gapsInput.filter((gap) => gap.type === 'input'),
      },
    });
  }, [blockId, gapsInput, handleInteractiveClick, id, revision]);

  const { results } = answer;

  const { correct, result } = verifyAnswers(results, reply.response);

  return (
    <>
      <ChunkWrapper>
        <GapsInput
          gaps={gapsInput}
          setGaps={setGapsInput}
          disabled={isSolved}
        />
      </ChunkWrapper>
      {isSolved ? (
        <ChunkWrapper>
          <Result correct={correct} result={result} gaps={gapsInput} />
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
  reply: FillTheGapBlockReplyType,
  isSolved: SolvedType,
};

export default FillTheGap;
