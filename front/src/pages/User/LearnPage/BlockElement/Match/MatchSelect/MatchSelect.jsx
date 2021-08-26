import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { MATCH_BLOCK_TYPE, MatchBlock } from './MatchBlock';
import { MatchSelectBlockType } from './types';
import * as S from './MatchSelect.styled';

const swapBlocks = (blocks, left, right) => {
  const newBlocks = blocks.map((x) => ({ ...x }));
  const leftIndex = newBlocks.findIndex((x) => x.id === left);
  const rightIndex = newBlocks.findIndex((x) => x.id === right);

  [newBlocks[leftIndex], newBlocks[rightIndex]] = [
    newBlocks[rightIndex],
    newBlocks[leftIndex],
  ];
  return newBlocks;
};

const selectedFunction = (x) => x.selected !== true;

const moveBlocksToTop = (left, right, leftId, rightId) => {
  const firstNotSelectedLeft = left.find(selectedFunction);
  const firstNotSelectedRight = right.find(selectedFunction);

  const newLeft = swapBlocks(left, leftId, firstNotSelectedLeft.id);
  const newRight = swapBlocks(right, rightId, firstNotSelectedRight.id);
  const firstNotSelectedNewLeft = newLeft.find(selectedFunction);
  const firstNotSelectedNewRight = newRight.find(selectedFunction);
  if (firstNotSelectedNewLeft && firstNotSelectedNewRight) {
    firstNotSelectedNewLeft.selected = true;
    firstNotSelectedNewRight.selected = true;
  }

  return [newLeft, newRight];
};

const MatchSelect = ({
  left,
  setLeft = () => {},
  right,
  setRight = () => {},
  disabled,
  showCorrect,
}) => {
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);

  const getMaxBlockHeight = useCallback(
    (index) =>
      Math.max(
        right[index]?.ref.current?.clientHeight,
        left[index]?.ref.current?.clientHeight,
      ),
    [left, right],
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
      if (id.startsWith('left')) {
        const indexLeft = left.findIndex((x) => x.id === id);
        unselectBlock(setLeft, id);
        unselectBlock(setRight, right[indexLeft].id);
      } else if (id.startsWith('right')) {
        const indexRight = right.findIndex((x) => x.id === id);
        unselectBlock(setLeft, left[indexRight].id);
        unselectBlock(setRight, id);
      }
    },
    [left, unselectBlock, setLeft, setRight, right],
  );

  const handleBlockClick = useCallback(
    (id, isFirst) => {
      const setFunc = isFirst ? setFirst : setSecond;
      const isLeftSelected = left.find((x) => x.id === id)?.selected;
      const isRightSelected = right.find((x) => x.id === id)?.selected;
      if (isLeftSelected || isRightSelected) {
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
    [first, left, removeSelected, right, second],
  );

  useEffect(() => {
    if (disabled) {
      return;
    }
    if (first && second) {
      setFirst(null);
      setSecond(null);
      const [newLeft, newRight] = moveBlocksToTop(left, right, first, second);
      setLeft(newLeft);
      setRight(newRight);
    }
  }, [disabled, first, left, right, second, setLeft, setRight]);

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

  return (
    <S.MatchWrapper>
      <S.MatchColumn disableAllAnimations={disabled}>
        {left?.map(({ ref, correct, selected, id, value }, index) => (
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
        {left?.map(
          ({ selected }, index) =>
            (selected || disabled) && (
              <S.ArrowConnectWrapper height={getMaxBlockHeight(index)}>
                <S.ArrowConnectImg />
              </S.ArrowConnectWrapper>
            ),
        )}
      </S.MatchMiddle>
      <S.MatchColumn disableAllAnimations={disabled}>
        {right?.map(({ ref, correct, selected, id, value }, index) => (
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

MatchSelect.propTypes = {
  disabled: PropTypes.bool,
  showCorrect: PropTypes.bool,
  left: MatchSelectBlockType,
  setLeft: PropTypes.func,
  right: MatchSelectBlockType,
  setRight: PropTypes.func,
};

export default MatchSelect;
