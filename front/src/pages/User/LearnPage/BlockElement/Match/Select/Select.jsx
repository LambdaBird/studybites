import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { MATCH_BLOCK_TYPE, MatchBlock } from './MatchBlock';
import * as S from './Select.styled';

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

const Select = ({
  from,
  setFrom = () => {},
  to,
  setTo = () => {},
  disabled,
  showCorrect,
}) => {
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
    [from, unselectBlock, setFrom, setTo, to],
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
    if (disabled) {
      return;
    }
    if (first && second) {
      setFirst(null);
      setSecond(null);
      const [newFrom, newTo] = moveBlocksToTop(from, to, first, second);
      setFrom(newFrom);
      setTo(newTo);
    }
  }, [disabled, first, from, second, setFrom, setTo, to]);

  const getBlockType = useCallback(
    (correct) => {
      if (showCorrect) {
        return MATCH_BLOCK_TYPE.NORMAL;
      }
      if (correct !== null) {
        return MATCH_BLOCK_TYPE.RESULT;
      }
      return MATCH_BLOCK_TYPE.SELECT;
    },
    [showCorrect],
  );
  /*

  useEffect(() => {
    setFrom((prev) =>
      values.map(({ from: fromValue, correct = null }, i) => ({
        ref: prev[i].ref,
        value: fromValue,
        id: `from-${i + 1}`,
        selected: false,
        correct,
      })),
    );
    setTo((prev) =>
      values.map(({ to: toValue, correct = null }, i) => ({
        ref: prev[i].ref,
        value: toValue,
        id: `to-${i + 1}`,
        selected: false,
        correct,
      })),
    );
  }, [values]);
*/

  return (
    <S.MatchWrapper>
      <S.MatchColumn disableAllAnimations={disabled}>
        {from?.map(({ ref, correct, selected, id, value }, index) => (
          <S.MatchBlockWrapper height={getMaxBlockHeight(index)} key={id}>
            <MatchBlock
              ref={ref}
              type={getBlockType(correct)}
              selected={selected || first === id}
              correct={correct}
              onClick={!disabled ? () => handleBlockClick(id, true) : null}
            >
              {value}
            </MatchBlock>
          </S.MatchBlockWrapper>
        ))}
      </S.MatchColumn>
      <S.MatchMiddle>
        {from?.map(
          ({ selected }, index) =>
            (selected || disabled) && (
              <S.ArrowConnectWrapper height={getMaxBlockHeight(index)}>
                <S.ArrowConnectImg />
              </S.ArrowConnectWrapper>
            ),
        )}
      </S.MatchMiddle>
      <S.MatchColumn disableAllAnimations={disabled}>
        {to?.map(({ ref, correct, selected, id, value }, index) => (
          <S.MatchBlockWrapper height={getMaxBlockHeight(index)} key={id}>
            <MatchBlock
              ref={ref}
              type={getBlockType(correct)}
              selected={selected || first === id}
              correct={correct}
              onClick={!disabled ? () => handleBlockClick(id, false) : null}
            >
              {value}
            </MatchBlock>
          </S.MatchBlockWrapper>
        ))}
      </S.MatchColumn>
    </S.MatchWrapper>
  );
};

Select.propTypes = {
  disabled: PropTypes.bool,
  showCorrect: PropTypes.bool,
  from: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ]),
      value: PropTypes.string,
      id: PropTypes.number,
      selected: PropTypes.bool,
      correct: PropTypes.bool,
    }),
  ),
  setFrom: PropTypes.func,
  to: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ]),
      value: PropTypes.string,
      id: PropTypes.number,
      selected: PropTypes.bool,
      correct: PropTypes.bool,
    }),
  ),
  setTo: PropTypes.func,
};

export default Select;
