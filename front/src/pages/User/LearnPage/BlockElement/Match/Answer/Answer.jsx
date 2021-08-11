import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import {
  BlockIdType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './Answer.styled';

const swapBlocks = (blocks, from1, from2, to1, to2) => {
  const from1Block = blocks.find((x) => x.id === from1);
  const to1Block = blocks.find((x) => x.id === to1);
  const from2Block = blocks.find((x) => x.id === from2);
  const to2Block = blocks.find((x) => x.id === to2);

  const tempFrom = from1Block.from;
  from1Block.from = from2Block.from;
  from2Block.from = tempFrom;
  const tempTo = to1Block.to;
  to1Block.to = to2Block.to;
  to2Block.to = tempTo;
};

const moveBlocksToTop = (blocks, from, to) => {
  const firstNotSelectedBlock = blocks.find((x) => x.selected !== true);
  swapBlocks(
    blocks,
    from,
    firstNotSelectedBlock.id,
    to,
    firstNotSelectedBlock.id,
  );
  firstNotSelectedBlock.selected = true;
  return blocks;
};

const Answer = ({ blockId, revision, values }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id: lessonId } = useContext(LearnContext);

  const [matches, setMatches] = useState(
    values.map((x, i) => ({
      ...x,
      id: i + 1,
    })),
  );

  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);

  const handleBlockClick = useCallback(
    (id, isFirst) => {
      const setFunc = isFirst ? setFirst : setSecond;
      if (matches.find((x) => x.id === id).selected) {
        setMatches((prev) => {
          const oldMatches = prev.slice();
          oldMatches.find((x) => x.id === id).selected = false;
          return oldMatches;
        });

        if (isFirst ? second : first) {
          setFunc(id);
        }
        return;
      }
      setFunc((prev) => {
        if (prev === id) {
          return null;
        }
        return id;
      });
    },
    [first, matches, second],
  );

  useEffect(() => {
    if (first && second) {
      setFirst(null);
      setSecond(null);
      setMatches(moveBlocksToTop(matches, first, second));
    }
  }, [first, matches, second]);

  return (
    <>
      <S.MatchWrapper>
        {matches.map(({ selected, id, from, to }) => (
          <S.MatchLine key={id}>
            <S.MatchBlock
              selected={selected || first === id}
              onClick={() => handleBlockClick(id, true)}
            >
              {from}
            </S.MatchBlock>
            {selected && <S.ArrowConnectImg />}
            <S.MatchBlock
              selected={selected || second === id}
              onClick={() => handleBlockClick(id, false)}
            >
              {to}
            </S.MatchBlock>
          </S.MatchLine>
        ))}
      </S.MatchWrapper>
      <S.ButtonWrapper>
        <S.LessonButtonSend
          onClick={() => {
            handleInteractiveClick({
              id: lessonId,
              action: RESPONSE_TYPE,
              blockId,
              revision,
              data: { response: matches.map(({ from, to }) => ({ from, to })) },
            });
          }}
        >
          {t('lesson.send')}
        </S.LessonButtonSend>
      </S.ButtonWrapper>
    </>
  );
};

Answer.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
};

export default Answer;
