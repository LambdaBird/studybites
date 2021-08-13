import PropTypes from 'prop-types';
import { createRef, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import {
  BlockIdType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './Answer.styled';

const swapBlocks = (blocks, from, to) => {
  const newBlocks = blocks.map((x) => ({ ...x }));
  const fromIndex = newBlocks.findIndex((x) => x.id === from);
  const toIndex = newBlocks.findIndex((x) => x.id === to);

  [newBlocks[fromIndex], newBlocks[toIndex]] = [
    newBlocks[toIndex],
    newBlocks[fromIndex],
  ];
  return newBlocks;
};

const selectedFunction = (x) => x.selected !== true;

const moveBlocksToTop = (from, to, fromId, toId) => {
  const firstNotSelectedFrom = from.find(selectedFunction);
  const firstNotSelectedTo = to.find(selectedFunction);

  const newFrom = swapBlocks(from, fromId, firstNotSelectedFrom.id);
  const newTo = swapBlocks(to, toId, firstNotSelectedTo.id);
  const firstNotSelectedNewFrom = newFrom.find(selectedFunction);
  const firstNotSelectedNewTo = newTo.find(selectedFunction);
  if (firstNotSelectedNewFrom && firstNotSelectedNewTo) {
    firstNotSelectedNewFrom.selected = true;
    firstNotSelectedNewTo.selected = true;
  }

  return [newFrom, newTo];
};

const Answer = ({ blockId, revision, values }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id: lessonId } = useContext(LearnContext);

  const [from, setFrom] = useState(
    values.map(({ from: fromValue }, i) => ({
      ref: createRef(),
      value: fromValue,
      id: `from-${i + 1}`,
      selected: false,
    })),
  );

  const [to, setTo] = useState(
    values.map(({ to: toValue }, i) => ({
      ref: createRef(),
      value: toValue,
      id: `to-${i + 1}`,
      selected: false,
    })),
  );

  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);

  const getMaxBlockHeight = useCallback(
    (index) =>
      Math.max(
        to[index]?.ref.current?.clientHeight,
        from[index]?.ref.current?.clientHeight,
      ),
    [from, to],
  );

  const unselectBlock = useCallback((setFunc, id) => {
    setFunc((prev) => {
      const old = prev.slice();
      old.find((x) => x.id === id).selected = false;
      return old;
    });
  }, []);

  const removeSelected = useCallback(
    (id) => {
      if (id.startsWith('from')) {
        const indexFrom = from.findIndex((x) => x.id === id);
        unselectBlock(setFrom, id);
        unselectBlock(setTo, to[indexFrom].id);
      } else if (id.startsWith('to')) {
        const indexTo = to.findIndex((x) => x.id === id);
        unselectBlock(setFrom, from[indexTo].id);
        unselectBlock(setTo, id);
      }
    },
    [from, unselectBlock, to],
  );

  const handleBlockClick = useCallback(
    (id, isFirst) => {
      const setFunc = isFirst ? setFirst : setSecond;
      const isFromSelected = from.find((x) => x.id === id)?.selected;
      const isToSelected = to.find((x) => x.id === id)?.selected;
      if (isFromSelected || isToSelected) {
        removeSelected(id);
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
    [first, from, removeSelected, second, to],
  );

  useEffect(() => {
    if (first && second) {
      setFirst(null);
      setSecond(null);
      const [newFrom, newTo] = moveBlocksToTop(from, to, first, second);
      setFrom(newFrom);
      setTo(newTo);
    }
  }, [first, from, second, to]);

  return (
    <>
      <S.MatchWrapper>
        <S.MatchColumn>
          {from.map(({ ref, selected, id, value }, index) => (
            <S.MatchBlockWrapper height={getMaxBlockHeight(index)} key={id}>
              <S.MatchBlock
                ref={ref}
                selected={selected || first === id}
                onClick={() => handleBlockClick(id, true)}
              >
                {value}
              </S.MatchBlock>
            </S.MatchBlockWrapper>
          ))}
        </S.MatchColumn>
        <S.MatchMiddle>
          {from.map(
            ({ selected }, index) =>
              selected && (
                <S.ArrowConnectWrapper height={getMaxBlockHeight(index)}>
                  <S.ArrowConnectImg />
                </S.ArrowConnectWrapper>
              ),
          )}
        </S.MatchMiddle>
        <S.MatchColumn>
          {to.map(({ ref, selected, id, value }, index) => (
            <S.MatchBlockWrapper height={getMaxBlockHeight(index)} key={id}>
              <S.MatchBlock
                ref={ref}
                selected={selected || second === id}
                onClick={() => handleBlockClick(id, false)}
              >
                {value}
              </S.MatchBlock>
            </S.MatchBlockWrapper>
          ))}
        </S.MatchColumn>
      </S.MatchWrapper>
      <S.ButtonWrapper>
        <S.LessonButtonSend
          onClick={() => {
            handleInteractiveClick({
              id: lessonId,
              action: RESPONSE_TYPE,
              blockId,
              revision,
              data: {
                response: from.map(({ value: fromValue }, index) => ({
                  from: fromValue,
                  to: to[index].value,
                })),
              },
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
