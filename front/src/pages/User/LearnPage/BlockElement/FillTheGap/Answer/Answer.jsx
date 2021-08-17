import { createRef, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import {
  BlockIdType,
  RevisionType,
  TextType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './Answer.styled';

const Answer = ({ blockId, revision, text = '' }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const chunks = useMemo(() => text?.split('{{ # }}'), [text]);

  const inputsRef = useRef(
    new Array(chunks.length - 1).fill(null).map(() => createRef()),
  );

  return (
    <>
      <ChunkWrapper>
        <S.ChunkText>
          {chunks.map((chunk, index) => {
            if (index === chunks.length - 1) {
              return <span>{chunk}</span>;
            }
            return (
              <>
                <span>{chunk}</span>
                <S.Input
                  placeholder={t('lesson.input_fill_gap.placeholder')}
                  ref={inputsRef.current[index]}
                />
              </>
            );
          })}
        </S.ChunkText>
      </ChunkWrapper>
      <S.LessonButton
        onClick={() => {
          handleInteractiveClick({
            id,
            action: RESPONSE_TYPE,
            revision,
            blockId,
            data: {
              response: inputsRef.current.map((x) => x.current.input.value),
            },
          });
        }}
      >
        {t('lesson.send')}
      </S.LessonButton>
    </>
  );
};

Answer.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  text: TextType,
};

export default Answer;
