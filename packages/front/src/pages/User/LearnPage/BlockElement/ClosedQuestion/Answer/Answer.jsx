import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import {
  BlockIdType,
  QuestionType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './Answer.styled';

const Answer = ({ blockId, revision, question }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const [input, setInput] = useState('');
  return (
    <>
      <ChunkWrapper isBottom>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <S.BlockWrapperWhite>
        <S.Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder={t('lesson.input_answer')}
        />
        <S.SendButton
          onClick={() => {
            handleInteractiveClick({
              id,
              action: RESPONSE_TYPE,
              blockId,
              revision,
              reply: { value: input },
            });
          }}
        >
          <S.RightOutlined />
        </S.SendButton>
      </S.BlockWrapperWhite>
    </>
  );
};

Answer.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  question: QuestionType,
};

export default Answer;
